import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all user recipes with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, category, favorite } = req.query;
    let query = 'SELECT * FROM recipes WHERE user_id = $1';
    const params = [req.user.id];
    let paramCount = 1;

    if (search) {
      paramCount++;
      query += ` AND (title ILIKE $${paramCount} OR ingredients ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (favorite === 'true') {
      query += ' AND is_favorite = true';
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recipes WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create recipe
router.post('/', async (req, res) => {
  try {
    const { title, description, ingredients, steps, image_url, category, prep_time, cook_time, servings } = req.body;

    if (!title || !ingredients || !steps) {
      return res.status(400).json({ error: 'Title, ingredients, and steps are required' });
    }

    const result = await pool.query(
      'INSERT INTO recipes (user_id, title, description, ingredients, steps, image_url, category, prep_time, cook_time, servings) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [req.user.id, title, description, ingredients, steps, image_url, category, prep_time, cook_time, servings]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update recipe
router.put('/:id', async (req, res) => {
  try {
    const { title, description, ingredients, steps, image_url, category, prep_time, cook_time, servings, rating, notes } = req.body;

    const result = await pool.query(
      'UPDATE recipes SET title = $1, description = $2, ingredients = $3, steps = $4, image_url = $5, category = $6, prep_time = $7, cook_time = $8, servings = $9, rating = $10, notes = $11 WHERE id = $12 AND user_id = $13 RETURNING *',
      [title, description, ingredients, steps, image_url, category, prep_time, cook_time, servings, rating, notes, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle favorite
router.patch('/:id/favorite', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE recipes SET is_favorite = NOT is_favorite WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
