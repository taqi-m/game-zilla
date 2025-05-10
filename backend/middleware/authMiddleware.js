const sql = require('mssql');
const config = require('../config/db');

module.exports = async (req, res, next) => {
    try {
        // Check if user ID is passed in the request headers
        // In a real application, you would use JWT tokens or sessions
        const userId = req.headers['user-id'];
        
        if (!userId) {
            return res.status(401).send('Authentication required');
        }
        
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT u.*, r.name as role_name 
                FROM USERS u
                LEFT JOIN ROLES r ON u.role_id = r.role_id
                WHERE u.user_id = @userId
            `);
        
        if (result.recordset.length === 0) {
            return res.status(401).send('Invalid user');
        }
        
        // Add user info to request object
        req.user = result.recordset[0];
        
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
