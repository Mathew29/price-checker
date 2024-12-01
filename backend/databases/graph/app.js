const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const graphRoutes = require('./routes/graphRoutes')



const app = express();

app.use(cors())
app.use(bodyParser.json());

app.use('/api/graph', graphRoutes);


module.exports = app;