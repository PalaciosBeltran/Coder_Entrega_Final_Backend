const ShoppingCart = require('../../data/carts/carts');
const Products = require('../../data/products/products');
let importedCarts = new ShoppingCart('carts.json');
let importedProducts = new Products('products.json');

const searchCart = async (req, res) => {
    const carts = await importedCarts.importInfo();
    const cartIndex = carts.findIndex(cart => cart.id === +req.params.id);
    if (cartIndex < 0) {
        return res.status(404).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún carrito con el Id ${req.params.id}.`});
    }
    return cartIndex;
}

const newCart = async (req, res, next) => {
    const carts = await importedCarts.importInfo();
    const products = await importedProducts.importInfo();
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
    await importedCarts.save(newCart);
    if(productFailure == undefined){
        res.json({ success: true, result: newCart.id });
    }   
    else{
        res.json({ success: false, result: newCart.id, error: productFailure });
    }
    
}

const deleteCartById = async (req, res) =>{
    const cartIndex = await searchCart(req, res);
    await importedCarts.deleteCartById(cartIndex); 
    return res.json({ success: true, result: `Carrito con el Id ${cartIndex+1} eliminado satisfactoriamente` });
}

const getProductsByCartId = async (req, res) => {
    const cartIndex = await searchCart(req, res);
    const productsByCartID = await importedCarts.getProductsByCartId(cartIndex);
    return res.json({ success: true, result: productsByCartID });
}

const newProductsToCartById = async (req, res) => {
    const carts = await importedCarts.importInfo();
    const products = await importedProducts.importInfo();
    const currentCart = carts.find(cart => cart.id == req.params.id);
    const cartIndex = await searchCart(req, res);
    req.body.forEach(id => {
        let product = products.find(product => product.id === id);
        if (!product) {
            productFailure = `Error ${res.statusCode}: No se pudo ingresar al carrito el producto con el Id ${id}. Verifique el Id.`;
        }
        else{
            currentCart.products.push(product);
        }        
    });    
    await importedCarts.updateProducts(cartIndex, currentCart);
    if(productFailure == undefined){
        res.json({ success: true, result: currentCart });
    }   
    else{
        res.json({ success: false, result: currentCart, error: productFailure });
    }
}

const deleteProductsByCartId = async (req, res) => {
    const carts = await importedCarts.importInfo();
    const cartIndex = await searchCart(req, res);
    if (cartIndex >= 0){
        const productIndex = carts[cartIndex].products.findIndex(product => product.id == +req.params.id_prod);
        if (productIndex < 0) {
            return res.status(404).json({ success: false, error: `Error ${res.statusCode}: No se encuentra el producto con el Id ${req.params.id_prod} dentro del carrito seleccionado.`});
        }
        await importedCarts.deleteProductsByCartId(cartIndex, productIndex); 
        return res.json({ success: true, result: `Producto con el ID ${req.params.id_prod} eliminado satisfactoriamente del carrito con el Id ${req.params.id}.` }); 
    }
}

const cartsApi = { newCart, deleteCartById, getProductsByCartId, newProductsToCartById, deleteProductsByCartId};
module.exports = cartsApi;