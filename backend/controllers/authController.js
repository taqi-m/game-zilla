const sql = require('mssql');
const config = require('../config/db');  // SQL Server config
const bcrypt = require('bcrypt');

// Login
exports.login = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        // Modified query to include role information through USER_ROLES and ROLES tables
        const result = await pool.request()
            .input('email', sql.NVarChar, req.body.email)
            .query(`
            SELECT u.*, r.name as role_name 
            FROM USERS u
            LEFT JOIN USER_ROLES ur ON u.user_id = ur.user_id
            LEFT JOIN ROLES r ON ur.role_id = r.role_id
            WHERE u.email = @email
            `);
        if (result.recordset.length === 0) {
            return res.status(400).send('Invalid credentials');
        }
        
        const user = result.recordset[0];
        
        // Compare password with hashed password in database
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password_hash);
        
        if (!isPasswordValid) {
            return res.status(400).send('Invalid Password');
        }
        
        // Don't send password hash to client
        delete user.password_hash;
        
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Register
exports.register = async (req, res) => {
    try {
        const { username, email, password_hash } = req.body;
        
        if (!username || !email || !password_hash) {
            return res.status(400).send('All fields are required');
        }
        
        const pool = await sql.connect(config);
        
        // Check if email already exists
        const emailCheck = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM USERS WHERE email = @email');
            
        if (emailCheck.recordset.length > 0) {
            return res.status(400).send('Email already in use');
        }
        
        // Check if username already exists
        const usernameCheck = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM USERS WHERE username = @username');
            
        if (usernameCheck.recordset.length > 0) {
            return res.status(400).send('Username already taken');
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_hash, salt);
        
        // Insert user into USERS table
        const userResult = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password_hash', sql.NVarChar, hashedPassword)
            .query(`
                INSERT INTO USERS (username, email, password_hash, is_verified, is_active, created_at, updated_at)
                OUTPUT INSERTED.user_id
                VALUES (@username, @email, @password_hash, 0, 1, GETDATE(), GETDATE())
            `);
        
        const userId = userResult.recordset[0].user_id;
        
        // Assign default role_id (3 - Customer) in USER_ROLES table
        await pool.request()
            .input('user_id', sql.Int, userId)
            .input('role_id', sql.Int, 3) // Default role_id for Customer
            .query(`
                INSERT INTO USER_ROLES (user_id, role_id)
                VALUES (@user_id, @role_id)
            `);
            
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Logout
exports.logout = async (req, res) => {
    // In a token-based auth system, the client would discard the token
    res.status(200).send('Logged out successfully');
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, req.user.id)  // Assuming user id is available in req.user
            .query('SELECT user_id, username, email, is_verified, is_active FROM USERS WHERE user_id = @userId');
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
