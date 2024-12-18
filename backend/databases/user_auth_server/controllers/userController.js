import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js';

export const registerUser = async (req, res) => {
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



export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '1h'});
            return res.json({ userId: user.id, token });
            }
        }
        res.status(401).json({ message: 'Invalid credentials' });

    } catch (error){
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }



};

export const logoutUser = (req,res) => {
    try{
        res.cookie("authToken", '', {maxAge: 0,httpOnly: true, path: '/'});
        return res.status(200).json({message: 'User Logged Out'})

    } catch(error){
        console.error("Error logging out", error);
        res.status(500).json({message: 'Server error'})
    }
}

export const trackUserItem = async (request, response) => {
    const { userId, productId } = request.body;

    try {
        await pool.query(
            `
            INSERT INTO user_item_tracking (user_id, item_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, item_id) DO NOTHING
            `,
            [userId, productId]
        );

        response.status(201).json({ message: "User item tracked successfully." });
    } catch (error) {
        console.error('Error in trackUserItem: ', error);
        response.status(500).json({ message: "Failed to track user item." });
    }
};

export const getUserTrackedItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query('SELECT * FROM user_item_tracking WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user item tracking data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteUserTrackedItem = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const trackingResult = await pool.query(
            'SELECT * FROM user_item_tracking WHERE user_id = $1 AND item_id = $2',
            [userId, productId]
        );

        if (trackingResult.rowCount === 0) {
            return res.status(404).json({ message: 'Tracked item not found.' });
        }

        await pool.query(
            'DELETE FROM user_item_tracking WHERE user_id = $1 AND item_id = $2',
            [userId, productId]
        );

        res.status(200).json({ message: 'Tracked item removed successfully.' });
    } catch (error) {
        console.error('Error removing tracked item:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export const setAlert = async (req, res) => {
    const data = req.body

    const {user_id, item_id, threshold_price} = data['alertData']

    if (!user_id || !item_id || !threshold_price) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const query = `
            INSERT INTO alerts (user_id, item_id, threshold_price)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const values = [user_id, item_id,threshold_price];
        const result = await pool.query(query, values);

        res.status(201).json({ message: "Alert created", alert_id: result.rows[0].id });

    }catch (error) {
        console.error("Error creating alert:", error);
        res.status(500).json({ error: "Failed to create alert" });
    }

}