require('dotenv').config()
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use('/api/users', userRoutes);

module.exports = app;
