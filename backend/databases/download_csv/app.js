const express = require('express');
const cors = require('cors')
const downloadRoutes = require('./routes/downloadRoutes')


const app = express();

app.use(cors())
app.use(express.json());

app.use('/api/download-csv', downloadRoutes);


module.exports = app;