const express = require(`express`);
const cartsController = require('../../controllers/carts.controllers');

const router = express.Router();

// POST:'/' - Crea un carrito y devuelve su id. 
// Se pueden incluir en el body los id de los productos que queremos dentro del nuevo carrito. Ejemplo: [3, 7].
router.post('/', cartsController.newCart);

// DELETE: '/:id' - Vacía un carrito y lo elimina.
router.delete('/:id', cartsController.deleteCartById);

// GET:'/:id/productos' - Me permite listar todos los productos guardados en el carrito.
router.get('/:id/productos', cartsController.getProductsByCartId);

// POST:'/:id/productos' - Para incorporar productos al carrito por su id de producto.
router.post('/:id/productos', cartsController.newProductsToCartById);

// DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto.
router.delete('/:id/productos/:id_prod', cartsController.deleteProductsByCartId)

module.exports = router;