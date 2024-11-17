const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Get member points
app.get('/api/points/:netid', async (req, res) => {
    try {
        const { netid } = req.params;
        const query = `
            SELECT m.first_name, m.last_name, 
                   COALESCE(SUM(pt.points_earned), 0) as total_points
            FROM members m
            LEFT JOIN points_tracking pt ON m.member_id = pt.member_id
            WHERE m.netid = $1
            GROUP BY m.member_id, m.first_name, m.last_name
        `;
        const result = await pool.query(query, [netid]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const query = `
            SELECT m.first_name, m.last_name, 
                   COALESCE(SUM(pt.points_earned), 0) as total_points
            FROM members m
            LEFT JOIN points_tracking pt ON m.member_id = pt.member_id
            GROUP BY m.member_id, m.first_name, m.last_name
            ORDER BY total_points DESC
            LIMIT 10
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});