const envConfig = require('../../config');

let ProductsDao;
let CartsDao;

switch(envConfig.DATASOURCE){
    case 'memory':
        ProductsDao = require('./products/products.memory.dao');
        CartsDao = require('./carts/carts.memory.dao');
        break;
    case 'file':
        ProductsDao = require('./products/products.file.dao');
        CartsDao = require('./carts/carts.file.dao');
        break;
    case 'localMongo':
        ProductsDao = require('./products/products.mongo.dao');
        CartsDao = require('./carts/carts.mongo.dao');
        break;
    case 'remoteMongo':
        ProductsDao = require('./products/products.mongo.dao');
        CartsDao = require('./carts/carts.mongo.dao');
        break;
    case 'firebase':
        ProductsDao = require('./products/products.firebase.dao');
        CartsDao = require('./carts/carts.firebase.dao');
        break;
    default:
        throw new Error('Datasource inválido');
}

module.exports = {
    ProductsDao,
    CartsDao
}