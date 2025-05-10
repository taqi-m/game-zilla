const sql = require('mssql');
const config = require('../config/db'); 

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT user_id, username, email, is_verified, is_active FROM USERS');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM USERS WHERE user_id = @id');
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Create user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password_hash } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password_hash', sql.NVarChar, password_hash)
            .query(`
                INSERT INTO USERS (username, email, password_hash, is_verified, is_active, created_at, updated_at)
                OUTPUT INSERTED.user_id
                VALUES (@username, @email, @password_hash, 0, 1, GETDATE(), GETDATE())
            `);
        res.status(201).json({ userId: result.recordset[0].user_id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { username, email, currentPassword, newPassword } = req.body;

        if (!email) {
            return res.status(400).send('Email is required.');
        }

        const pool = await sql.connect(config);
        const request = pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('id', sql.Int, req.params.id);

        if (currentPassword && newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            request.input('password_hash', sql.NVarChar, hashedPassword);
            await request.query(`
                UPDATE USERS 
                SET username = @username, email = @email, password_hash = @password_hash, updated_at = GETDATE() 
                WHERE user_id = @id
            `);
        } else {
            await request.query(`
                UPDATE USERS 
                SET username = @username, email = @email, updated_at = GETDATE() 
                WHERE user_id = @id
            `);
        }

        res.status(200).send('User updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM USERS WHERE user_id = @id');
        res.status(200).send('User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
