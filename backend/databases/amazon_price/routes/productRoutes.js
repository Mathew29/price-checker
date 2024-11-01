const express = require('express');
const { addProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/add-product', addProduct);
router.get('/tracked-items/:user_id', getTrackedItems);

module.exports = router;