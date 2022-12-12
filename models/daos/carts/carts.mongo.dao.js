const { Schema } = require('mongoose');
const MongoContainer = require('../../containers/container.mongo');

const collection = 'carts';

const productsSchema = new Schema({
    id: { type: Number},
    productTimeStamp: {type: Date},
    products: {type: Object},
});

class CartsMongoDao extends MongoContainer {
    constructor(){
        super(collection, productsSchema);
    }
    
    async deleteProductsByCartId(cartIndex, productIndex){
        try{
            const carts = await this.importInfo();
            const updatedProducts = carts[cartIndex].products.splice(productIndex+1, 1);
            const document = await this.model.findOneAndUpdate({ _id: carts[cartIndex]._id}, { products: updatedProducts});
            if(!document){
                const errorMessage = `No se encuentra ningún producto con el ID ${cartIndex}.`
                throw new HttpError(HTTP_STATUS.NOT_FOUND, errorMessage);
            }            
            return document;
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = CartsMongoDao;