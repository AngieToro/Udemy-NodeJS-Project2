const express = require('express');
const shopControler = require('../controllers/shop');

const router = express.Router();

router.get('/', shopControler.getIndex);

router.get('/products', shopControler.getProducts);

router.get('/products/:productId', shopControler.getProduct);

router.get('/cart', shopControler.getCart);

router.post('/cart', shopControler.postCart);

router.post('/cart-delete-item', shopControler.postDeleteProductCart);

router.post('/create-order', shopControler.postOrder);

router.get('/orders', shopControler.getOrders);

module.exports = router;