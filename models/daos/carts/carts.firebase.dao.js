const FirebaseContainer = require('../../containers/container.firebase');

const collection = 'carts';

class CartsFirebaseDao extends FirebaseContainer {
    constructor(){
        super(collection);
    }

    async deleteProductsByCartId(cartIndex, productIndex){
        try{
            const carts = await this.importInfo();            
            carts[cartIndex].products.splice(productIndex, 1);
            const id = carts[cartIndex].id;
            const docRef = this.query.doc(`${id}`);         
            if(!docRef){
                const errorMessage = `No se encuentra ningún producto con el Id ${elementIndex}.`
                throw new HttpError(HTTP_STATUS.NOT_FOUND, errorMessage);
            }
            return await docRef.update(carts[cartIndex]);


        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = CartsFirebaseDao;