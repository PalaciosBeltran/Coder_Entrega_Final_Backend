const { ProductsDao } = require('../models/daos/app.daos');
const { CartsDao } = require('../models/daos/app.daos');
const { HTTP_STATUS } = require('../constants/api.constants');
const { successResponse } = require('../utils/api.utils');
const envConfig = require('../config');
const { v4: uuid } = require("uuid");

const productsDao = new ProductsDao ();
const cartsDao = new CartsDao ();

class CartsController {

    async searchCart(req, res, next) {
        try{
            const cart = await cartsDao.getById(req.params.id, 'carts');
            if (!cart) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún carrito con el ID ${req.params.id}.`});
            }
            return cart;
        }
        catch(error){
            next(error);
        }
    }
    
    async newCart(req, res, next) {
        try{
            const products = await productsDao.importInfo();
            let failureMessage = undefined;
            let failure = false;
            let newCart = {
                cartTimestamp: Date.now(),
                products: [],
            };
            if(req.body.length > 0){
                req.body.forEach(_id => {
                    let product = products.find(product => product._id == _id);
                    if (!product) {
                        failureMessage = `Error ${res.statusCode}: No se pudo ingresar al carrito el producto con el Id ${_id}. Verifique el Id.`;
                        failure = true;
                    }
                    else{
                        newCart.products.push(product);
                    }             
                });    
            }    
            await cartsDao.save(newCart);
            const response = successResponse(newCart);
            if(failure == false){
                return res.status(HTTP_STATUS.OK).json(response);
            }   
            else{
                return res.status(HTTP_STATUS.OK).json({response: response, error: failureMessage });
            }
        }
        catch(error){
            next(error);
        }  
    }
    
    async deleteCartById (req, res, next) {
        try{
            const cart = await cartsDao.getById(req.params.id, 'carts');
            if(cart){
                await cartsDao.deleteById(req.params.id); 
                const result = `Carrito con el ID ${req.params.id} eliminado satisfactoriamente`;
                const response = successResponse(result);
                return res.status(HTTP_STATUS.OK).json(response);
            }
            else{
                return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún carrito con el ID ${req.params.id}.`});
            }
        }
        catch(error){
            next(error);
        }
    }
    
    async getProductsByCartId(req, res, next) {
        try{
            let productsByCartID = await cartsDao.getById(req.params.id, 'carts');
            if(envConfig.DATASOURCE=='memory'||envConfig.DATASOURCE=='file'||envConfig.DATASOURCE=='firebase'){
                if(productsByCartID){
                    productsByCartID = productsByCartID[0];
                    const response = successResponse(productsByCartID.products);
                    return res.status(HTTP_STATUS.OK).json(response);
                }
                else{
                    res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error: `Error ${res.statusCode}: No se puede encontrar el carrito con el ID ${req.params.id}. Verifique el ID.` });
                }
            }
            else{
                if(productsByCartID){
                    const response = successResponse(productsByCartID.products);
                    return res.status(HTTP_STATUS.OK).json(response);
                }
                else{
                    res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error: `Error ${res.statusCode}: No se puede encontrar el carrito con el ID ${req.params.id}. Verifique el ID.` });
                }
            }
        }
        catch(error){
            next(error);
        }
    }
    
    async newProductsToCartById(req, res, next) {
        try{
            const carts = await cartsDao.importInfo();
            const products = await productsDao.importInfo();
            const currentCart = carts.find(cart => cart._id == req.params.id);            
            let failureMessage = undefined;
            let failure = false;
            let success = false;
            let failureID = undefined;
            if(currentCart){
                req.body.forEach(_id => {
                    let product = products.find(product => product._id == _id);
                    if (!product) {
                        failureMessage = `Error ${res.statusCode}: No se pudo ingresar al carrito el producto con el Id ${_id}. Verifique el ID.`;
                        failure = true;
                        failureID = _id;
                    }
                    else{
                        currentCart.products.push(product);
                        success = true;
                    }        
                });    
                await cartsDao.update(req.params.id, currentCart);
                const response = successResponse(currentCart);
                if(failure == false && success == true){
                    return res.status(HTTP_STATUS.OK).json(response);
                }   
                else if(failure == true && success == true){
                    return res.status(HTTP_STATUS.OK).json({response: response, error: failureMessage });
                }
                else if(failure == true && success == false){
                    return res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error: `Error ${res.statusCode}: No se puede encontrar el producto con el ID ${failureID}. Verifique el ID.` });
                }
            }
            else{
                res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error: `Error ${res.statusCode}: No se puede encontrar el carrito con el ID ${req.params.id}. Verifique el ID.` });
            }
        }
        catch(error){
            next(error);
        }
    }
    
    async deleteProductsByCartId(req, res, next) {
        try{
            const carts = await cartsDao.importInfo();
            let cart = await cartsDao.getById(req.params.id, 'carts');
            if(envConfig.DATASOURCE=='memory'||envConfig.DATASOURCE=='file'||envConfig.DATASOURCE=='firebase'){
                cart = cart[0];
            }
            if (cart){
                const cartIndex = carts.findIndex(cart => cart._id == req.params.id);
                const productIndex = cart.products.findIndex(product => product._id == req.params.id_prod);
                if (productIndex < 0) {
                    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra el producto con el ID ${req.params.id_prod} dentro del carrito seleccionado.`});
                }
                await cartsDao.deleteProductsByCartId(cartIndex, productIndex); 
                const result = `Producto con el ID ${req.params.id_prod} eliminado satisfactoriamente del carrito con el ID ${req.params.id}.`;
                const response = successResponse(result);
                res.status(HTTP_STATUS.OK).json(response); 
            }
            else{
                return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra el carrito con el ID ${req.params.id}.`});
            }
        }
        catch(error){
            next(error);
        }
    }    
}

module.exports = new CartsController();