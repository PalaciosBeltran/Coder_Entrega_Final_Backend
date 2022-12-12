const express = require(`express`);
const cartsController = require('../../controllers/carts.controllers');

const router = express.Router();

router.post('/', cartsController.newCart);
router.delete('/:id', cartsController.deleteCartById);
router.get('/:id/productos', cartsController.getProductsByCartId);
router.post('/:id/productos', cartsController.newProductsToCartById);
router.delete('/:id/productos/:id_prod', cartsController.deleteProductsByCartId)

module.exports = router;