const express = require('express')
const router = express.Router()
const {downloadCSV} = require('../controllers/downloadController')

router.post('/download', downloadCSV)

module.exports = router