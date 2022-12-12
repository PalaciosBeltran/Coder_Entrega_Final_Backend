const { ProductsDao } = require('../models/daos/app.daos');
const { HTTP_STATUS } = require('../constants/api.constants');
const { successResponse } = require('../utils/api.utils');
const envConfig = require('../config');

const productsDao = new ProductsDao();

class ProductsController {

  async getProducts(req, res, next) {
    try{
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
          return res.status(HTTP_STATUS.OK).json(response);
        }
        if (search) {
          products = products.filter(product => product.name.toLowerCase().startsWith(search.toLowerCase()))
          response = successResponse(products);            
          if(products.length == 0){
            return res.status(HTTP_STATUS.NOT_FOUND).json({success: false, error: `Error ${res.statusCode}: No se encontraron productos con el nombre ${search}.`});
          }
          return res.status(HTTP_STATUS.OK).json(response);
        }
        return res.status(404).send({success: false, error : -2 , description: `Error ${res.statusCode}: El filtro ${Object.keys(req.query)[0]} para la ruta ${req.baseUrl} no es correcto. Verifique la ruta o consulte al administrador.`});          
      }
      return res.status(HTTP_STATUS.OK).json(response);
    }   
    catch(error){
      next(error);
    }
  }

  async getProductByID(req, res, next) {
      try{
        let productByID = await productsDao.getById(req.params.id);
        if (productByID) {    
          const response = successResponse(productByID);
          return res.status(HTTP_STATUS.OK).json(response);      
        }
        else{
          res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún producto con el ID ${req.params.id}.`});
        }
      }
      catch(error){
        next(error);
      }
  }

  async saveNewProduct(req, res, next) {
    const products = await productsDao.importInfo();
    const { user } = req.query;
    try{
      if(user == 'admin'){
        const { name, description, code, thumbnail, price, stock } = req.body;
        if ( !name || !description || !code || !thumbnail || !price || !stock ) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error: `Error ${res.statusCode}: El formato proporcionado no es correcto. Verificar los campos introducidos.` });
        }
        else{
          let newProduct = {};
          if(products.length>0){
            newProduct = {      
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
    catch(error){
      next(error);
    }

  }

  async updateCurrentProduct(req, res, next) {
      const { user } = req.query;
      try{
        if(user == 'admin'){
          const { name, description, code, thumbnail, price, stock } = req.body;
          if ( !name || !description || !code || !thumbnail || !price || !stock ) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Error ${res.statusCode}: El formato proporcionado no es correcto. Verificar los campos introducidos.` });
          }
          else{
            const productToUpdate = await productsDao.getById(req.params.id, 'products');
            if(productToUpdate){
              let updatedProduct;
              if(envConfig.DATASOURCE=='firebase'){
                updatedProduct = {
                  productTimestamp: Date.now(),
                  name,
                  description,
                  code,
                  thumbnail,
                  price,
                  stock
                };
              }
              else{
                updatedProduct = {
                  id: req.params.id,
                  productTimestamp: Date.now(),
                  name,
                  description,
                  code,
                  thumbnail,
                  price,
                  stock
                };
              }
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
      catch(error){
        next(error);
      }
  }

  async deleteProduct(req, res, next) {
      const { user } = req.query;
      try{
        if(user == 'admin'){
          const productToDelete = await productsDao.getById(req.params.id);
          if(productToDelete){
            const updatedProducts = await productsDao.deleteById(req.params.id);
            res.status(HTTP_STATUS.OK).json({success: true, message: `El producto con el ID ${req.params.id} ha sido eliminado satisfactoriamente.`, data: updatedProducts});
          }
          else{
            res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún producto con el ID ${req.params.id}.`});
          }
        }
        else{
          res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Error ${res.statusCode}: Permiso inválido. El método ${req.method} para la ruta ${req.baseUrl} solo puede ser ejecutado por un administrador autorizado.`})
        }
      }
      catch(error){
        next(error);
      }
  }
}

module.exports = new ProductsController();