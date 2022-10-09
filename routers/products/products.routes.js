const express = require('express');
const productsApi = require('../../api/products/products.api');

const router = express.Router();

// GET: '/' - Me permite listar todos los productos disponibles (disponible para usuarios y administradores).
router.get('/', productsApi.getProducts);

// GET: '/:id' - Me permite listar un producto por su id (disponible para usuarios y administradores).
router.get('/:id', productsApi.getProductByID);

// POST:'/' - Para incorporar productos al listado (disponible para administradores).
// Ejemplo: http://localhost:8080/api/productos?user=admin
router.post('/', productsApi.saveNewProduct);

// PUT: '/:id' - Actualiza un producto por su id (disponible para administradores).
// Ejemplo: http://localhost:8080/api/productos/3?user=admin
router.put('/:id', productsApi.updateCurrentProduct);

// DELETE: '/:id' - Borra un producto por su id (disponible para administradores).
// Ejemplo: http://localhost:8080/api/productos/3?user=admin   
router.delete('/:id', productsApi.deleteProduct);

module.exports = router;