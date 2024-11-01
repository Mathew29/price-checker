const express = require('express');
const bodyParser = require('body-parser');
const db = require('./controllers/productController')
const productRoutes = require('./routes/productRoutes')

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use('/api/product', productRoutes)


module.exports = app;
