const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');


const registerUser = async (req, res) => {
    const { password, email } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (password_hash, email) VALUES ($1, $2) RETURNING *',
            [hashedPassword, email]
        );

        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            return res.json({ token });
        }
    }

    res.status(401).json({ message: 'Invalid credentials' });
};

const logoutUser = (req,res) => {
    try{
        // res.cookie("authToken", '', {maxAge: 0,httpOnly: true, path: '/'});
        return res.status(200).json({message: 'User Logged Out'})

    } catch(error){
        console.error("Error logging out", error);
        res.status(500).json({message: 'Server error'})
    }
}

module.exports = { registerUser, loginUser, logoutUser };