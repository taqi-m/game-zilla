const sql = require('mssql');
const config = require('../config/db');

// Get all orders (admin function)
exports.getAllOrders = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`
                SELECT o.order_id, o.user_id, u.username, o.order_date, 
                       o.subtotal, o.shipping_cost, o.total_amount, 
                       o.status, o.updated_at
                FROM ORDERS o
                JOIN USERS u ON o.user_id = u.user_id
                ORDER BY o.order_date DESC
            `);
        
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get all orders for a user
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM ORDERS WHERE user_id = @userId');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Place order
exports.placeOrder = async (req, res) => {
    try {
        const { user_id, cart_id, payment_id, shipping_address, billing_address } = req.body;
        
        // Check if user_id exists
        if (!user_id) {
            return res.status(400).send('User ID is required');
        }
        
        const pool = await sql.connect(config);

        // Join with GAMES table to ensure we get the correct prices
        const cartItems = await pool.request()
            .input('cartId', sql.Int, cart_id)
            .query(`
                SELECT ci.*, g.price as unit_price 
                FROM CART_ITEMS ci
                JOIN GAMES g ON ci.game_id = g.game_id
                WHERE ci.cart_id = @cartId
            `);
        
        if (cartItems.recordset.length === 0) {
            return res.status(400).send('Cart is empty');
        }

        let subtotal = 0;
        cartItems.recordset.forEach(item => {
            // Add validation to ensure price and quantity are numbers
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.unit_price) || 0;
            subtotal += quantity * price;
        });

        // Ensure subtotal is a valid number
        subtotal = Number(subtotal.toFixed(2));
        if (isNaN(subtotal) || subtotal <= 0) {
            return res.status(400).send('Invalid cart items or prices');
        }

        console.log('Subtotal:', subtotal);
        // Calculate tax amount (8%)
        const taxAmount = parseFloat((subtotal * 0.08).toFixed(2));
        const shippingCost = 5.00;
        const totalAmount = parseFloat((subtotal + taxAmount + shippingCost).toFixed(2));

        // Modified query to use a table variable to handle triggers properly
        const orderResult = await pool.request()
            .input('userId', sql.Int, user_id)
            .input('subtotal', sql.Decimal(10, 2), subtotal)
            .input('taxAmount', sql.Decimal(10, 2), taxAmount)
            .input('shippingCost', sql.Decimal(10, 2), shippingCost)
            .input('totalAmount', sql.Decimal(10, 2), totalAmount)
            .input('shipping_address', sql.NVarChar, shipping_address || "Default Shipping Address")
            .input('billing_address', sql.NVarChar, billing_address || "Default Billing Address")
            .query(`
                DECLARE @InsertedOrder TABLE (order_id INT);
                
                INSERT INTO ORDERS (user_id, order_date, subtotal, tax_amount, shipping_cost, total_amount, status, shipping_address, billing_address, updated_at)
                OUTPUT INSERTED.order_id INTO @InsertedOrder
                VALUES (@userId, GETDATE(), @subtotal, @taxAmount, @shippingCost, @totalAmount, 'Completed', @shipping_address, @billing_address, GETDATE());
                
                SELECT order_id FROM @InsertedOrder;
            `);

        const orderId = orderResult.recordset[0].order_id;
        
        for (const item of cartItems.recordset) {
            await pool.request()
                .input('orderId', sql.Int, orderId)
                .input('gameId', sql.Int, item.game_id)
                .input('quantity', sql.Int, item.quantity)
                .input('unitPrice', sql.Decimal, item.unit_price)
                .query(`
                    INSERT INTO ORDER_ITEMS (order_id, game_id, quantity, unit_price, subtotal)
                    VALUES (@orderId, @gameId, @quantity, @unitPrice, @quantity * @unitPrice)
                `);
        }

        // Update payment record with order_id
        await pool.request()
            .input('orderId', sql.Int, orderId)
            .input('paymentId', sql.Int, payment_id)
            .query('UPDATE PAYMENTS SET order_id = @orderId WHERE payment_id = @paymentId');

        await pool.request()
            .input('cartId', sql.Int, cart_id)
            .query('DELETE FROM CART_ITEMS WHERE cart_id = @cartId');

        res.status(201).json({ 
            success: true,
            message: 'Order placed successfully',
            order_id: orderId
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('orderId', sql.Int, req.params.orderId)
            .query('SELECT * FROM ORDERS WHERE order_id = @orderId');
        
        if (result.recordset.length === 0) {
            return res.status(404).send('Order not found');
        }

        // Get order items with game details
        const orderItems = await pool.request()
            .input('orderId', sql.Int, req.params.orderId)
            .query(`
                SELECT oi.*, g.title, g.platform, gi.image_url
                FROM ORDER_ITEMS oi
                JOIN GAMES g ON oi.game_id = g.game_id
                LEFT JOIN GAME_IMAGES gi ON g.game_id = gi.game_id AND gi.is_primary = 1
                WHERE oi.order_id = @orderId
            `);

        // Get payment details
        const paymentDetails = await pool.request()
            .input('orderId', sql.Int, req.params.orderId)
            .query('SELECT * FROM PAYMENTS WHERE order_id = @orderId');
        
        res.status(200).json({
            order: result.recordset[0],
            items: orderItems.recordset,
            payment: paymentDetails.recordset[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('orderId', sql.Int, req.params.orderId)
            .input('status', sql.NVarChar, status)
            .query('UPDATE ORDERS SET status = @status, updated_at = GETDATE() WHERE order_id = @orderId');
        res.status(200).send('Order status updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Process payment
exports.processPayment = async (req, res) => {
    try {
        const { 
            user_id, cart_id, amount, payment_method, 
            card_last4, paypal_email, upi_id,
            shipping_address, billing_address 
        } = req.body;
        
        const pool = await sql.connect(config);
        
        // Create payment record with additional fields
        const paymentResult = await pool.request()
            .input('paymentDate', sql.DateTime2, new Date())
            .input('amount', sql.Decimal(10, 2), amount)
            .input('paymentMethod', sql.VarChar(50), payment_method)
            .input('status', sql.VarChar(50), 'completed')
            .input('transactionId', sql.VarChar(100), `TR-${Date.now()}`)
            .input('cardLast4', sql.VarChar(4), card_last4 || null)
            .input('paypalEmail', sql.VarChar(255), paypal_email || null)
            .input('upiId', sql.VarChar(255), upi_id || null)
            .query(`
                INSERT INTO PAYMENTS (
                    payment_date, amount, payment_method, status, 
                    transaction_id, card_last4, paypal_email, upi_id
                )
                OUTPUT INSERTED.payment_id
                VALUES (
                    @paymentDate, @amount, @paymentMethod, @status,
                    @transactionId, @cardLast4, @paypalEmail, @upiId
                )
            `);
            
        const payment_id = paymentResult.recordset[0].payment_id;
        
        res.status(200).json({
            success: true,
            payment_id: payment_id
        });
    } catch (err) {
        console.error('Payment processing error:', err);
        res.status(500).json({
            success: false,
            error: 'Payment processing failed'
        });
    }
};
