const { ProductsDao } = require('../../models/daos/app.daos');
const { CartsDao } = require('../../models/daos/app.daos');
const { HTTP_STATUS } = require('../../constants/api.constants');
const { successResponse } = require('../../utils/api.utils');

const productsDao = new ProductsDao ();
const cartsDao = new CartsDao ();


const searchCart = async (req, res) => {
    const carts = await cartsDao.importInfo();
    const cartIndex = carts.findIndex(cart => cart.id === +req.params.id);
    if (cartIndex < 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún carrito con el Id ${req.params.id}.`});
    }
    return cartIndex;
}

const newCart = async (req, res, next) => {
    const carts = await cartsDao.importInfo();
    const products = await productsDao.importInfo();
    let productFailure = undefined;
    const newCart = {
        id: carts.length + 1,
        cartTimestamp: Date.now(),
        products: [],
    }; 
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
    const cartIndex = await searchCart(req, res);
    await cartsDao.deleteById(cartIndex); 
    const result = `Carrito con el Id ${cartIndex+1} eliminado satisfactoriamente`;
    const response = successResponse(result);
    res.status(HTTP_STATUS.OK).json(response);
}

const getProductsByCartId = async (req, res) => {
    const cartIndex = await searchCart(req, res);
    const productsByCartID = await cartsDao.getById(cartIndex);
    const response = successResponse(productsByCartID);
    return res.status(HTTP_STATUS.OK).json(response);
}

const newProductsToCartById = async (req, res) => {
    const carts = await cartsDao.importInfo();
    const products = await productsDao.importInfo();
    const currentCart = carts.find(cart => cart.id == req.params.id);
    const cartIndex = await searchCart(req, res);
    let productFailure = undefined;
    req.body.forEach(id => {
        let product = products.find(product => product.id === id);
        if (!product) {
            productFailure = `Error ${res.statusCode}: No se pudo ingresar al carrito el producto con el Id ${id}. Verifique el Id.`;
        }
        else{
            currentCart.products.push(product);
        }        
    });    
    await cartsDao.update(cartIndex, currentCart);
    const response = successResponse(currentCart);
    if(productFailure == undefined){
        res.status(HTTP_STATUS.OK).json(response);
    }   
    else{
        res.status(HTTP_STATUS.BAD_REQUEST).json({ succes: false, error:  productFailure });
    }
}

const deleteProductsByCartId = async (req, res) => {
    const carts = await cartsDao.importInfo();
    const cartIndex = await searchCart(req, res);
    if (cartIndex >= 0){
        const productIndex = carts[cartIndex].products.findIndex(product => product.id == +req.params.id_prod);
        if (productIndex < 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: `Error ${res.statusCode}: No se encuentra el producto con el Id ${req.params.id_prod} dentro del carrito seleccionado.`});
        }
        await cartsDao.deleteProductsByCartId(cartIndex, productIndex); 
        const result = `Producto con el ID ${req.params.id_prod} eliminado satisfactoriamente del carrito con el Id ${req.params.id}.`;
        const response = successResponse(result);
        res.status(HTTP_STATUS.OK).json(response); 
    }
}

const cartsController = { newCart, deleteCartById, getProductsByCartId, newProductsToCartById, deleteProductsByCartId};
module.exports = cartsController;