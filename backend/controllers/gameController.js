const sql = require('mssql');
const config = require('../config/db'); 

// Get all games
exports.getAllGames = async (req, res) => {
    try {
        const { sort, genre, platform } = req.query;
        
        const pool = await sql.connect(config);
        let query = `
            SELECT g.*, gi.image_url 
            FROM GAMES g
            LEFT JOIN GAME_IMAGES gi ON g.game_id = gi.game_id AND gi.is_primary = 1
            WHERE 1=1
        `;
        
        const params = [];
        
        // Add filters if specified
        if (genre) {
            query += ` AND g.genre = @genre`;
            params.push({
                name: 'genre',
                type: sql.VarChar,
                value: genre
            });
        }
        
        if (platform) {
            query += ` AND g.platform = @platform`;
            params.push({
                name: 'platform',
                type: sql.VarChar,
                value: platform
            });
        }
        
        // Add sorting
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    query += ` ORDER BY g.price ASC`;
                    break;
                case 'price_desc':
                    query += ` ORDER BY g.price DESC`;
                    break;
                case 'release_date_desc':
                    query += ` ORDER BY g.release_date DESC`;
                    break;
                case 'title_asc':
                    query += ` ORDER BY g.title ASC`;
                    break;
                default:
                    query += ` ORDER BY g.is_featured DESC, g.game_id DESC`;
            }
        } else {
            // Default sort by featured and then newest
            query += ` ORDER BY g.is_featured DESC, g.game_id DESC`;
        }
        
        const request = pool.request();
        
        // Add parameters to request
        params.forEach(param => {
            request.input(param.name, param.type, param.value);
        });
        
        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get game by ID
exports.getGameById = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT g.*, gi.image_url 
                FROM GAMES g
                LEFT JOIN GAME_IMAGES gi ON g.game_id = gi.game_id AND gi.is_primary = 1
                WHERE g.game_id = @id
            `);
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Create game
exports.createGame = async (req, res) => {
    try {
        const { title, description, price, genre, platform, developer, release_date, is_featured } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('title', sql.NVarChar, title)
            .input('description', sql.Text, description)
            .input('price', sql.Decimal, price)
            .input('genre', sql.NVarChar, genre)
            .input('platform', sql.NVarChar, platform)
            .input('developer', sql.NVarChar, developer)
            .input('release_date', sql.Date, release_date)
            .input('is_featured', sql.Bit, is_featured)
            .query(`
                INSERT INTO GAMES (title, description, price, genre, platform, developer, release_date, is_featured, created_at, updated_at)
                VALUES (@title, @description, @price, @genre, @platform, @developer, @release_date, @is_featured, GETDATE(), GETDATE())
            `);
        res.status(201).send('Game created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update game
exports.updateGame = async (req, res) => {
    try {
        const { title, description, price, genre, platform, developer, release_date, is_featured } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('title', sql.NVarChar, title)
            .input('description', sql.Text, description)
            .input('price', sql.Decimal, price)
            .input('genre', sql.NVarChar, genre)
            .input('platform', sql.NVarChar, platform)
            .input('developer', sql.NVarChar, developer)
            .input('release_date', sql.Date, release_date)
            .input('is_featured', sql.Bit, is_featured)
            .input('id', sql.Int, req.params.id)
            .query('UPDATE GAMES SET title = @title, description = @description, price = @price, genre = @genre, platform = @platform, developer = @developer, release_date = @release_date, is_featured = @is_featured, updated_at = GETDATE() WHERE game_id = @id');
        res.status(200).send('Game updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Delete game
exports.deleteGame = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM GAMES WHERE game_id = @id');
        res.status(200).send('Game deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get games by category
exports.getGamesByCategory = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('categoryId', sql.Int, req.params.categoryId)
            .query(`
                SELECT g.*
                FROM GAMES g
                JOIN GAME_CATEGORIES gc ON g.game_id = gc.game_id
                WHERE gc.category_id = @categoryId
            `);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get distinct genres
exports.getGenres = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT DISTINCT genre FROM GAMES WHERE genre IS NOT NULL ORDER BY genre
        `);
        
        // Extract genres into a simple array
        const genres = result.recordset.map(row => row.genre);
        res.status(200).json(genres);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get distinct platforms
exports.getPlatforms = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT DISTINCT platform FROM GAMES WHERE platform IS NOT NULL ORDER BY platform
        `);
        
        // Extract platforms into a simple array
        const platforms = result.recordset.map(row => row.platform);
        res.status(200).json(platforms);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
