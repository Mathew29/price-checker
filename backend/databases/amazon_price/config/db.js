const { query } = require('express')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: process.env.BACKEND_AMAZON_USER,
    host: process.env.BACKEND_AMAZON_HOST,
    database: process.env.BACKEND_AMAZON_NAME,
    password: process.env.BACKEND_AMAZON_PASSWORD,
    port: process.env.BACKEND_AMAZON_DB_PORT,
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}