const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const { scheduleProductUpdate } = require('./jobs/scheduler');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use('/api/product', productRoutes)

scheduleProductUpdate()


module.exports = app;
