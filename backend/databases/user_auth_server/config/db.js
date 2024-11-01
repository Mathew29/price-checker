const { Pool } = require('pg');
require('dotenv').config()

const pool = new Pool({
    user: process.env.BACKEND_AMAZON_USER,
    host: process.env.BACKEND_AMAZON_HOST,
    database: process.env.SIGNIN_SERVER_NAME,
    password: process.env.BACKEND_AMAZON_PASSWORD,
    port: 5432,
});

module.exports = pool;