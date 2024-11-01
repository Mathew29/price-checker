const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');


const registerUser = async (req, res) => {
    const { username, password_hash } = req.body;
    console.log('Received:', username, password_hash);

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password_hash, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



const loginUser = async (req, res) => {
    const { username, password_hash } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password_hash, user.password_hash);

        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            return res.json({ token });
        }
    }

    res.status(401).json({ message: 'Invalid credentials' });
};

module.exports = { registerUser, loginUser };