const { Schema } = require('mongoose');
const MongoContainer = require('../../containers/container.mongo');

const collection = 'products';

const productsSchema = new Schema({
    id: { type: Number},
    productTimeStamp: {type: Date},
    name: {type: String},
    description: {type: String},
    code: {type: String},
    thumbnail: {type: String},
    price: {type: Number},
    stock: {type: Number}
});

class ProductsMongoDao extends MongoContainer {
    constructor(){
        super(collection, productsSchema);
    }
}

module.exports = ProductsMongoDao;