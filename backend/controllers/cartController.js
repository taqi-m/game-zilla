const sql = require('mssql');
const config = require('../config/db');

// Get user's cart
exports.getCartByUser = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM CARTS WHERE user_id = @userId');
        
        if (result.recordset.length === 0) {
            return res.status(200).json({ cart: null, items: [] });
        }

        const cartId = result.recordset[0].cart_id;
        
        // Join with GAMES to get game details along with cart items
        const cartItems = await pool.request()
            .input('cartId', sql.Int, cartId)
            .query(`
                SELECT ci.*, g.title, g.price as unit_price, g.platform, gi.image_url
                FROM CART_ITEMS ci
                JOIN GAMES g ON ci.game_id = g.game_id
                LEFT JOIN GAME_IMAGES gi ON g.game_id = gi.game_id AND gi.is_primary = 1
                WHERE ci.cart_id = @cartId
            `);
        
        res.status(200).json({
            cart: result.recordset[0],
            items: cartItems.recordset,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { game_id, quantity, user_id } = req.body;
        const userId = user_id || req.user.id;
        
        const pool = await sql.connect(config);

        // Get or create cart
        const cartResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT cart_id FROM CARTS WHERE user_id = @userId');
        
        let cartId;
        if (cartResult.recordset.length === 0) {
            const insertResult = await pool.request()
                .input('userId', sql.Int, userId)
                .query('INSERT INTO CARTS (user_id, created_at, updated_at) OUTPUT INSERTED.cart_id VALUES (@userId, GETDATE(), GETDATE())');
            cartId = insertResult.recordset[0].cart_id;
        } else {
            cartId = cartResult.recordset[0].cart_id;
        }

        // Check if item already exists in cart
        const existingItemResult = await pool.request()
            .input('cartId', sql.Int, cartId)
            .input('gameId', sql.Int, game_id)
            .query('SELECT * FROM CART_ITEMS WHERE cart_id = @cartId AND game_id = @gameId');

        if (existingItemResult.recordset.length > 0) {
            // Update quantity if item already exists
            const currentQuantity = existingItemResult.recordset[0].quantity;
            const newQuantity = currentQuantity + quantity;
            
            await pool.request()
                .input('cartId', sql.Int, cartId)
                .input('gameId', sql.Int, game_id)
                .input('quantity', sql.Int, newQuantity)
                .input('updatedAt', sql.DateTime, new Date())
                .query('UPDATE CART_ITEMS SET quantity = @quantity, updated_at = @updatedAt WHERE cart_id = @cartId AND game_id = @gameId');
        } else {
            // Insert new item if it doesn't exist
            await pool.request()
                .input('cartId', sql.Int, cartId)
                .input('gameId', sql.Int, game_id)
                .input('quantity', sql.Int, quantity)
                .query('INSERT INTO CART_ITEMS (cart_id, game_id, quantity, added_at) VALUES (@cartId, @gameId, @quantity, GETDATE())');
        }

        res.status(201).send('Item added to cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { cart_item_id, quantity } = req.body;
        const pool = await sql.connect(config);
        
        // Update the quantity in CART_ITEMS table
        await pool.request()
            .input('cartItemId', sql.Int, cart_item_id)
            .input('quantity', sql.Int, quantity)
            .query('UPDATE CART_ITEMS SET quantity = @quantity WHERE cart_item_id = @cartItemId');
        
        // Update the updated_at column in CARTS table
        await pool.request()
            .input('cartItemId', sql.Int, cart_item_id)
            .query(`
                UPDATE CARTS
                SET updated_at = GETDATE()
                WHERE cart_id = (
                    SELECT cart_id
                    FROM CART_ITEMS
                    WHERE cart_item_id = @cartItemId
                )
            `);
        
        res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const cart_item_id = req.params.cart_item_id;
        const pool = await sql.connect(config);
        await pool.request()
            .input('cartItemId', sql.Int, cart_item_id)
            .query('DELETE FROM CART_ITEMS WHERE cart_item_id = @cartItemId');
        res.status(200).send('Item removed from cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('userId', sql.Int, req.user.id)
            .query('DELETE FROM CART_ITEMS WHERE cart_id IN (SELECT cart_id FROM CARTS WHERE user_id = @userId)');
        res.status(200).send('Cart cleared');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
