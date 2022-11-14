const { ProductsDao } = require('../models/daos/app.daos');
const { HTTP_STATUS } = require('../constants/api.constants');
const { successResponse } = require('../utils/api.utils');

const productsDao = new ProductsDao();

const getProducts = async (req, res) => {
    const { maxPrice, search } = req.query;    
    let products = await productsDao.importInfo();
    let response = successResponse(products);
    if (Object.keys(req.query).length > 0) {
      if (maxPrice) {
        if (isNaN(+maxPrice)) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({success: false, error: `Error ${res.statusCode}: El precio máximo proporcionado no es correcto. Verificar que el número sea un valor válido.`});
        }
        products = products.filter(product => product.price <= +maxPrice);
        response = successResponse(products);
      }
      if (search) {
        products = products.filter(product => product.name.toLowerCase().startsWith(search.toLowerCase()))
        response = successResponse(products);
        if(products.length == 0){
          return res.status(HTTP_STATUS.NOT_FOUND).json({success: false, error: `Error ${res.statusCode}: No se encontraron productos con el nombre ${search}.`});
        }
      }
      return res.status(HTTP_STATUS.OK).json(response);
    }
    return res.status(HTTP_STATUS.OK).json(response);
}

const getProductByID = async (req, res) => {    
    let productByID = await productsDao.getById(req.params.id);
    if (productByID || productByID.length>0) {      
      const response = successResponse(productByID);
      return res.status(HTTP_STATUS.OK).json(response);      
    }
    else{
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún producto con el ID ${req.params.id}.`});
    }
}

const saveNewProduct = async (req, res) => {
    const products = await productsDao.importInfo();
    const { user } = req.query;
    if(user == 'admin'){
      const { name, description, code, thumbnail, price, stock } = req.body;
      if ( !name || !description || !code || !thumbnail || !price || !stock ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error: `Error ${res.statusCode}: El formato proporcionado no es correcto. Verificar los campos introducidos.` });
      }
      else{
        let newProduct = {};
        if(products.length>0){
          newProduct = {      
            id: products[products.length-1].id + 1,
            productTimestamp: Date.now(),
            name,
            description,
            code,
            thumbnail,
            price,
            stock
          };
        }
        else if(products.length==0){
          newProduct = {      
            id: 1,
            productTimestamp: Date.now(),
            name,
            description,
            code,
            thumbnail,
            price,
            stock
          };
        }
        await productsDao.save(newProduct);
        const response = successResponse(newProduct);
        res.status(HTTP_STATUS.CREATED).json(response);
      }
    }
    else{
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Error ${res.statusCode}: Permiso inválido. El método ${req.method} para la ruta ${req.baseUrl} solo puede ser ejecutado por un administrador autorizado.`})
    }
}

const updateCurrentProduct = async (req, res) => {
    const { user } = req.query;
    if(user == 'admin'){
      const { name, description, code, thumbnail, price, stock } = req.body;
      if ( !name || !description || !code || !thumbnail || !price || !stock ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Error ${res.statusCode}: El formato proporcionado no es correcto. Verificar los campos introducidos.` });
      }
      else{
        const productToUpdate = await productsDao.getById(req.params.id);
        if(productToUpdate){
          let updatedId = parseInt(req.params.id, 10);
          const updatedProduct = {
            id: updatedId,
            productTimestamp: Date.now(),
            name,
            description,
            code,
            thumbnail,
            price,
            stock
          };
          await productsDao.update(req.params.id, updatedProduct);
          const response = successResponse(updatedProduct);
          res.status(HTTP_STATUS.CREATED).json(response);
        }
        else{
          res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún producto con el ID ${req.params.id}.`});
        }
      }
    }
    else{
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Error ${res.statusCode}: Permiso inválido. El método ${req.method} para la ruta ${req.baseUrl} solo puede ser ejecutado por un administrador autorizado.`})
    }
}

const deleteProduct = async (req, res) => {
    const { user } = req.query;
    if(user == 'admin'){
      const productToDelete = await productsDao.getById(req.params.id);
      if(productToDelete){
        const updatedProducts = await productsDao.deleteById(req.params.id);
        const response = successResponse(updatedProducts);
        res.status(HTTP_STATUS.OK).json(response);
      }
      else{
        res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún producto con el ID ${req.params.id}.`});
      }
    }
    else{
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Error ${res.statusCode}: Permiso inválido. El método ${req.method} para la ruta ${req.baseUrl} solo puede ser ejecutado por un administrador autorizado.`})
    }
}

const productsController = { getProducts, getProductByID, saveNewProduct, updateCurrentProduct, deleteProduct};
module.exports = productsController;