require('dotenv').config()
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const {alert} = require('./jobs/scheduler')

const app = express();

app.use(express.json());

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use('/api/users', userRoutes);
alert()

module.exports = app;
