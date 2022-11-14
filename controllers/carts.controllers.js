const { ProductsDao } = require('../models/daos/app.daos');
const { CartsDao } = require('../models/daos/app.daos');
const { HTTP_STATUS } = require('../constants/api.constants');
const { successResponse } = require('../utils/api.utils');

const productsDao = new ProductsDao ();
const cartsDao = new CartsDao ();

const searchCart = async (req, res) => {
    const cart = await cartsDao.getById(req.params.id, 'carts');
    if (!cart) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún carrito con el ID ${req.params.id}.`});
    }
    return cart;
}

const newCart = async (req, res) => {
    const carts = await cartsDao.importInfo();
    const products = await productsDao.importInfo();
    let productFailure = undefined;
    let newCart = {};
    if(carts.length > 0){
        newCart = {
            id: carts[carts.length-1].id + 1,
            cartTimestamp: Date.now(),
            products: [],
        };
    }
    else if (carts.length == 0){
        newCart = {
            id: 1,
            cartTimestamp: Date.now(),
            products: [],
        };
    }
    if(req.body.length > 0){
        req.body.forEach(id => {
            let product = products.find(product => product.id === id);
            if (!product) {
                productFailure = `Error ${res.statusCode}: No se pudo ingresar al carrito el producto con el Id ${id}. Verifique el Id.`;
            }
            else{
                newCart.products.push(product);
            }             
        });    
    }    
    await cartsDao.save(newCart);
    const response = successResponse(newCart);
    if(productFailure == undefined){
        res.status(HTTP_STATUS.OK).json(response);
    }   
    else{
        res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error:  productFailure });
    }    
}

const deleteCartById = async (req, res) =>{
    await cartsDao.deleteById(req.params.id); 
    const result = `Carrito con el ID ${req.params.id} eliminado satisfactoriamente`;
    const response = successResponse(result);
    res.status(HTTP_STATUS.OK).json(response);
}

const getProductsByCartId = async (req, res) => {
    const productsByCartID = await cartsDao.getById(req.params.id, 'carts');
    if(productsByCartID[0]){
        const response = successResponse(productsByCartID[0].products);
        return res.status(HTTP_STATUS.OK).json(response);
    }
    else{
        res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error: `Error ${res.statusCode}: No se puede encontrar el carrito con el ID ${req.params.id}. Verifique el ID.` });
    }
}

const newProductsToCartById = async (req, res) => {
    const carts = await cartsDao.importInfo();
    const products = await productsDao.importInfo();
    const currentCart = carts.find(cart => cart.id == req.params.id);
    let productFailure = undefined;
    if(currentCart){
        req.body.forEach(id => {
            let product = products.find(product => product.id === id);
            if (!product) {
                productFailure = `Error ${res.statusCode}: No se pudo ingresar al carrito el producto con el ID ${id}. Verifique el ID.`;
            }
            else{
                currentCart.products.push(product);
            }        
        });    
        await cartsDao.update(req.params.id, currentCart);
        const response = successResponse(currentCart);
        if(productFailure == undefined){
            res.status(HTTP_STATUS.OK).json(response);
        }   
        else{
            res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error:  productFailure });
        }
    }
    else{
        res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error: `Error ${res.statusCode}: No se puede encontrar el carrito con el ID ${req.params.id}. Verifique el ID.` });
    }
}

const deleteProductsByCartId = async (req, res) => {
    const carts = await cartsDao.importInfo();
    const cart = await searchCart(req, res);
    if (cart[0]){
        const cartIndex = carts.findIndex(cart => cart.id == +req.params.id);
        const productIndex = cart[0].products.findIndex(product => product.id == +req.params.id_prod);
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

const cartsController = { newCart, deleteCartById, getProductsByCartId, newProductsToCartById, deleteProductsByCartId};
module.exports = cartsController;