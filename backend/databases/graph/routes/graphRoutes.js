const express = require('express')
const {generateLineGraph} = require('../controllers/graphController')

const router = express.Router()

router.post('/', generateLineGraph)

module.exports = router;