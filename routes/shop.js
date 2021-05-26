const express = require('express');
const shopControler = require('../controllers/shop');

const router = express.Router();

router.get('/', shopControler.getIndex);

router.get('/products', shopControler.getProducts);

router.get('/products/:productId', shopControler.getProduct);

router.get('/cart', shopControler.getCart);

router.post('/cart', shopControler.postCart);

router.get('/orders', shopControler.getOrders);

router.get('/checkout', shopControler.getChekout);

router.post('/cart-delete-item', shopControler.postDeleteProductCart);

module.exports = router;