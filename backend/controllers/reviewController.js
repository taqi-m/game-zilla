const sql = require('mssql');
const config = require('../config/db');

// Get all reviews for a game
exports.getReviewsForGame = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('gameId', sql.Int, req.params.game_id)
            .query('SELECT * FROM REVIEWS WHERE game_id = @gameId');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Add a review
exports.addReview = async (req, res) => {
    try {
        const { game_id, rating, comment } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('userId', sql.Int, req.user.id)
            .input('gameId', sql.Int, game_id)
            .input('rating', sql.Int, rating)
            .input('comment', sql.Text, comment)
            .query('INSERT INTO REVIEWS (user_id, game_id, rating, comment, created_at, updated_at) VALUES (@userId, @gameId, @rating, @comment, GETDATE(), GETDATE())');
        res.status(201).send('Review added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update a review - fix the typo in the function name
exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const reviewId = req.params.reviewId;
        
        const pool = await sql.connect(config);
        
        // First check if the review belongs to the user
        const reviewCheck = await pool.request()
            .input('reviewId', sql.Int, reviewId)
            .input('userId', sql.Int, req.user.id)
            .query('SELECT * FROM REVIEWS WHERE review_id = @reviewId AND user_id = @userId');
            
        if (reviewCheck.recordset.length === 0) {
            return res.status(403).send('You are not authorized to update this review');
        }
        
        await pool.request()
            .input('reviewId', sql.Int, reviewId)
            .input('rating', sql.Int, rating)
            .input('comment', sql.NVarChar, comment)
            .query('UPDATE REVIEWS SET rating = @rating, comment = @comment, updated_at = GETDATE() WHERE review_id = @reviewId');
            
        res.status(200).send('Review updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const pool = await sql.connect(config);
        
        // First check if the review belongs to the user
        const reviewCheck = await pool.request()
            .input('reviewId', sql.Int, reviewId)
            .input('userId', sql.Int, req.user.id)
            .query('SELECT * FROM REVIEWS WHERE review_id = @reviewId AND user_id = @userId');
            
        if (reviewCheck.recordset.length === 0) {
            return res.status(403).send('You are not authorized to delete this review');
        }
        
        await pool.request()
            .input('reviewId', sql.Int, reviewId)
            .query('DELETE FROM REVIEWS WHERE review_id = @reviewId');
            
        res.status(200).send('Review deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('reviewId', sql.Int, req.params.reviewId)
            .query('SELECT * FROM REVIEWS WHERE review_id = @reviewId');
        if (result.recordset.length === 0) {
            return res.status(404).send('Review not found');
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};