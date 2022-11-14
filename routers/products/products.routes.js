const express = require('express');
const productsController = require('../../controllers/products.controllers');

const router = express.Router();

// GET: '/' - Me permite listar todos los productos disponibles (disponible para usuarios y administradores).
router.get('/', productsController.getProducts);

// GET: '/:id' - Me permite listar un producto por su id (disponible para usuarios y administradores).
router.get('/:id', productsController.getProductByID);

// POST:'/' - Para incorporar productos al listado (disponible para administradores).
// Ejemplo: http://localhost:8080/api/productos?user=admin
router.post('/', productsController.saveNewProduct);

// PUT: '/:id' - Actualiza un producto por su id (disponible para administradores).
// Ejemplo: http://localhost:8080/api/productos/3?user=admin
router.put('/:id', productsController.updateCurrentProduct);

// DELETE: '/:id' - Borra un producto por su id (disponible para administradores).
// Ejemplo: http://localhost:8080/api/productos/3?user=admin   
router.delete('/:id', productsController.deleteProduct);

module.exports = router;