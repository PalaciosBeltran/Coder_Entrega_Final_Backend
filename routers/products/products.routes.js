const express = require('express');
const productsController = require('../../controllers/products.controllers');

const router = express.Router();

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductByID);
router.post('/', productsController.saveNewProduct);
router.put('/:id', productsController.updateCurrentProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;