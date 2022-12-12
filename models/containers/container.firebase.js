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
        const docRef = await this.query.get();
        const documents = docRef.docs;
        let docFind = documents.map(document => {
            let docsTest = {
                _id: document.id,
                ...document.data()
            }
            return docsTest;
        })
        return docFind;
    }

    async getById(id){
        const docRef = await this.query.get();
        const documents = docRef.docs;
        const validDocs = documents.map(document => {
            return{
                _id: document.id,
                ...document.data()
            }
        });
        let docbyId = validDocs.filter(document => document._id == id);
        if(docbyId.length == 0){
            docbyId = undefined;
        };
        return docbyId;
    }

    async save(newElement){
        const docRef = this.query.doc();
        return await docRef.set(newElement);
    }

    async update(id, updatedElement){
        const docRef = this.query.doc(id);
        if(!docRef){
            const errorMessage = `No se encuentra ningún producto con el ID ${elementIndex}.`
            throw new HttpError(HTTP_STATUS.NOT_FOUND, errorMessage);
        }
        return await docRef.update(updatedElement);
    }

    async deleteById(id){
        const docRef = this.query.doc(id);
        await docRef.delete();
        return await this.importInfo();
    }
}

module.exports = FirebaseContainer;