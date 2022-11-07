const FirebaseContainer = require('../../containers/container.firebase');

const collection = 'carts';

class CartsFirebaseDao extends FirebaseContainer {
    constructor(){
        super(collection);
    }
}

module.exports = CartsFirebaseDao;