const sql = require('mssql');
const config = require('../config/db');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT u.*, r.role_name 
            FROM USERS u
            LEFT JOIN USER_ROLES ur ON u.user_id = ur.user_id
            LEFT JOIN ROLES r ON ur.role_id = r.role_id
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT o.*, u.username, u.email 
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

// Update user role
exports.updateUserRole = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;
        const pool = await sql.connect(config);
        
        // Check if user already has a role
        const roleCheck = await pool.request()
            .input('userId', sql.Int, user_id)
            .query('SELECT * FROM USER_ROLES WHERE user_id = @userId');
            
        if (roleCheck.recordset.length > 0) {
            // Update existing role
            await pool.request()
                .input('userId', sql.Int, user_id)
                .input('roleId', sql.Int, role_id)
                .query('UPDATE USER_ROLES SET role_id = @roleId WHERE user_id = @userId');
        } else {
            // Insert new role
            await pool.request()
                .input('userId', sql.Int, user_id)
                .input('roleId', sql.Int, role_id)
                .query('INSERT INTO USER_ROLES (user_id, role_id) VALUES (@userId, @roleId)');
        }
        
        res.status(200).send('User role updated');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Assign permission to role
exports.assignPermissionToRole = async (req, res) => {
    try {
        const { role_id, permission_id } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('roleId', sql.Int, role_id)
            .input('permissionId', sql.Int, permission_id)
            .query(`
                INSERT INTO ROLE_PERMISSIONS (role_id, permission_id)
                VALUES (@roleId, @permissionId)
            `);
        res.status(201).send('Permission assigned to role successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        
        // Get total users count
        const usersResult = await pool.request()
            .query('SELECT COUNT(*) AS totalUsers FROM USERS');
        const totalUsers = usersResult.recordset[0].totalUsers;
        
        // Get total orders count
        const ordersResult = await pool.request()
            .query('SELECT COUNT(*) AS totalOrders FROM ORDERS');
        const totalOrders = ordersResult.recordset[0].totalOrders;
        
        // Get total revenue
        const revenueResult = await pool.request()
            .query('SELECT SUM(total_amount) AS totalRevenue FROM ORDERS');
        const totalRevenue = revenueResult.recordset[0].totalRevenue || 0;
        
        // Get recent activities (orders)
        const recentActivitiesResult = await pool.request()
            .query(`
                SELECT TOP 5 o.order_id, o.user_id, u.username, o.order_date, o.total_amount, o.status
                FROM ORDERS o
                JOIN USERS u ON o.user_id = u.user_id
                ORDER BY o.order_date DESC
            `);
        
        res.status(200).json({
            totalUsers,
            totalOrders,
            totalRevenue,
            recentActivity: recentActivitiesResult.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Sales reports
exports.getSalesReport = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        
        // Get daily sales for the last 30 days
        const dailySales = await pool.request().query(`
            SELECT 
                CAST(order_date AS DATE) AS date,
                COUNT(order_id) AS orderCount,
                SUM(total_amount) AS revenue
            FROM ORDERS
            WHERE order_date >= DATEADD(day, -30, GETDATE())
            GROUP BY CAST(order_date AS DATE)
            ORDER BY date
        `);
        
        // Get top selling games
        const topGames = await pool.request().query(`
            SELECT TOP 10
                g.game_id, g.title, g.platform,
                SUM(oi.quantity) AS totalQuantity,
                SUM(oi.subtotal) AS totalRevenue
            FROM ORDER_ITEMS oi
            JOIN GAMES g ON oi.game_id = g.game_id
            JOIN ORDERS o ON oi.order_id = o.order_id
            GROUP BY g.game_id, g.title, g.platform
            ORDER BY totalQuantity DESC
        `);
        
        res.status(200).json({
            dailySales: dailySales.recordset,
            topGames: topGames.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// User reports
exports.getUsersReport = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        
        // Get new users per day for the last 30 days
        const newUsers = await pool.request().query(`
            SELECT 
                CAST(created_at AS DATE) AS date,
                COUNT(user_id) AS userCount
            FROM USERS
            WHERE created_at >= DATEADD(day, -30, GETDATE())
            GROUP BY CAST(created_at AS DATE)
            ORDER BY date
        `);
        
        // Get top users by order count
        const topUsersByOrders = await pool.request().query(`
            SELECT TOP 10
                u.user_id, u.username, u.email,
                COUNT(o.order_id) AS orderCount,
                SUM(o.total_amount) AS totalSpent
            FROM USERS u
            JOIN ORDERS o ON u.user_id = o.user_id
            GROUP BY u.user_id, u.username, u.email
            ORDER BY orderCount DESC
        `);
        
        res.status(200).json({
            newUsers: newUsers.recordset,
            topUsersByOrders: topUsersByOrders.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get all games for admin
exports.getAllGames = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT g.*, 
                (SELECT TOP 1 image_url FROM GAME_IMAGES gi WHERE gi.game_id = g.game_id AND is_primary = 1) AS primary_image
            FROM GAMES g
            ORDER BY g.title
        `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Admin update game
exports.updateGame = async (req, res) => {
    try {
        const { game_id } = req.params;
        const { title, description, price, stock_quantity, developer, publisher, release_date, platform, genre, is_featured } = req.body;
        
        const pool = await sql.connect(config);
        await pool.request()
            .input('gameId', sql.Int, game_id)
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description)
            .input('price', sql.Decimal(10, 2), price)
            .input('stockQuantity', sql.Int, stock_quantity)
            .input('developer', sql.NVarChar, developer)
            .input('publisher', sql.NVarChar, publisher)
            .input('releaseDate', sql.Date, release_date)
            .input('platform', sql.NVarChar, platform)
            .input('genre', sql.NVarChar, genre)
            .input('isFeatured', sql.Bit, is_featured)
            .query(`
                UPDATE GAMES
                SET title = @title,
                    description = @description,
                    price = @price,
                    stock_quantity = @stockQuantity,
                    developer = @developer,
                    publisher = @publisher,
                    release_date = @releaseDate,
                    platform = @platform,
                    genre = @genre,
                    is_featured = @isFeatured,
                    updated_at = GETDATE()
                WHERE game_id = @gameId
            `);
        
        res.status(200).send('Game updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Admin add game
exports.addGame = async (req, res) => {
    try {
        const { title, description, price, stock_quantity, developer, publisher, release_date, platform, genre, is_featured, image_url } = req.body;
        
        const pool = await sql.connect(config);
        
        // Insert game
        const gameResult = await pool.request()
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description)
            .input('price', sql.Decimal(10, 2), price)
            .input('stockQuantity', sql.Int, stock_quantity)
            .input('developer', sql.NVarChar, developer)
            .input('publisher', sql.NVarChar, publisher)
            .input('releaseDate', sql.Date, release_date)
            .input('platform', sql.NVarChar, platform)
            .input('genre', sql.NVarChar, genre)
            .input('isFeatured', sql.Bit, is_featured || 0)
            .query(`
                INSERT INTO GAMES (title, description, price, stock_quantity, developer, publisher, release_date, platform, genre, is_featured, created_at, updated_at)
                OUTPUT INSERTED.game_id
                VALUES (@title, @description, @price, @stockQuantity, @developer, @publisher, @releaseDate, @platform, @genre, @isFeatured, GETDATE(), GETDATE())
            `);
        
        const gameId = gameResult.recordset[0].game_id;
        
        // Insert image if provided
        if (image_url) {
            await pool.request()
                .input('gameId', sql.Int, gameId)
                .input('imageUrl', sql.NVarChar, image_url)
                .query(`
                    INSERT INTO GAME_IMAGES (game_id, image_url, is_primary, created_at)
                    VALUES (@gameId, @imageUrl, 1, GETDATE())
                `);
        }
        
        res.status(201).json({ 
            message: 'Game added successfully',
            game_id: gameId
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Delete game
exports.deleteGame = async (req, res) => {
    try {
        const { game_id } = req.params;
        
        const pool = await sql.connect(config);
        
        // Delete game images first (due to foreign key constraint)
        await pool.request()
            .input('gameId', sql.Int, game_id)
            .query('DELETE FROM GAME_IMAGES WHERE game_id = @gameId');
            
        // Delete the game
        await pool.request()
            .input('gameId', sql.Int, game_id)
            .query('DELETE FROM GAMES WHERE game_id = @gameId');
        
        res.status(200).send('Game deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
