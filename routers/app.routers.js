const express = require('express');
const productsRoutes = require('./products/products.routes');
const cartRoutes = require('./carts/carts.routes');

const router = express.Router();

router.use('/productos' , productsRoutes);
router.use('/carrito' , cartRoutes);

module.exports = router;