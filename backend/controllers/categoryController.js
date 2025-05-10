const sql = require('mssql');
const config = require('../config/db');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM CATEGORIES');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Create category (renamed from addCategory)
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).send('Category name is required');
        }

        const pool = await sql.connect(config);
        
        // Check for duplicate name
        const existingCategory = await pool.request()
            .input('name', sql.VarChar(200), name)
            .query('SELECT * FROM CATEGORIES WHERE name = @name');
            
        if (existingCategory.recordset.length > 0) {
            return res.status(400).send('Category already exists');
        }

        const result = await pool.request()
            .input('name', sql.VarChar(200), name)
            .query('INSERT INTO CATEGORIES (name) OUTPUT INSERTED.category_id VALUES (@name)');
            
        res.status(201).json({
            message: 'Category created successfully',
            categoryId: result.recordset[0].category_id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryId = req.params.id;

        if (!name || name.trim() === '') {
            return res.status(400).send('Category name is required');
        }

        const pool = await sql.connect(config);
        
        // Check if category exists
        const existingCategory = await pool.request()
            .input('categoryId', sql.Int, categoryId)
            .query('SELECT * FROM CATEGORIES WHERE category_id = @categoryId');
            
        if (existingCategory.recordset.length === 0) {
            return res.status(404).send('Category not found');
        }

        await pool.request()
            .input('categoryId', sql.Int, categoryId)
            .input('name', sql.VarChar(200), name)
            .query('UPDATE CATEGORIES SET name = @name WHERE category_id = @categoryId');
            
        res.status(200).send('Category updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const pool = await sql.connect(config);

        // Check if category exists
        const existingCategory = await pool.request()
            .input('categoryId', sql.Int, categoryId)
            .query('SELECT * FROM CATEGORIES WHERE category_id = @categoryId');
            
        if (existingCategory.recordset.length === 0) {
            return res.status(404).send('Category not found');
        }

        await pool.request()
            .input('categoryId', sql.Int, categoryId)
            .query('DELETE FROM CATEGORIES WHERE category_id = @categoryId');
            
        res.status(200).send('Category deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
