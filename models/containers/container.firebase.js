const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const dbConfig = require ('../../databases/databases.config');
const { HttpError } = require('../../utils/api.utils');
const { HTTP_STATUS } = require('../../constants/api.constants');

class FirebaseContainer{
    constructor(collection){
        const db = getFirestore();
        this.query = db.collection(collection);
        this.collection = collection;
    }

    static async connect(){
        admin.initializeApp({
            credential: admin.credential.cert(dbConfig.firebase.credentials)
        })
    }

    async importInfo(){
        try{
            const docRef = await this.query.get();
            const documents = docRef.docs;
            return documents.map(document => {
                return{
                    id: document.id,
                    ...document.data()
                }
            })
        }
        catch(error){
            console.log(error.message);
        }
    }

    async getById(elementIndex){
        try{
            const docRef = await this.query.where('id', '==', `${elementIndex}`).get();
            console.log(docRef);
            if (!docRef) {
              const message = `Resource with id ${elementIndex} does not exist in our records`;
              throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
            }

            return docRef;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async save(newElement){
        try{
            const docRef = this.query.doc();
            return await docRef.set(newElement);
        }
        catch(error){
            console.log(error.message);
        }
    }

    async update(elementIndex, updatedElement){
        try{
            const docRef = this.query.doc(`${elementIndex}`);
            if(!docRef){
                const errorMessage = `No se encuentra ningún producto con el Id ${elementIndex}.`
                throw new HttpError(HTTP_STATUS.NOT_FOUND, errorMessage);
            }
            return await docRef.update(updatedElement)
        }
        catch(error){
            console.log(error.message);
        }
    }

    async deleteById(elementIndex){
        try{
            const id = elementIndex +1;
            const docRef = this.query.doc(`${id}`);
            return await docRef.delete();
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = FirebaseContainer;