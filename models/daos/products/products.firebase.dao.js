const FirebaseContainer = require('../../containers/container.firebase');

const collection = 'products';

class ProductsFirebaseDao extends FirebaseContainer {
    constructor(){
        super(collection);
    }
}

module.exports = ProductsFirebaseDao;