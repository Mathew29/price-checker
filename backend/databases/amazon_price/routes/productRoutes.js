const express = require('express');
const { addProduct, getProductDetails} = require('../controllers/productController');
const router = express.Router();

router.post('/add-product', addProduct);
router.get('/product-details/:productId', getProductDetails);

module.exports = router;