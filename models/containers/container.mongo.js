const mongoose = require ('mongoose');
const dbConfig = require ('../../databases/databases.config');
const envConfig = require('../../config');
const { HttpError } = require('../../utils/api.utils');
const { HTTP_STATUS } = require('../../constants/api.constants');

class MongoContainer{
    constructor(collection, schema){
        this.model = mongoose.model(collection, schema);
    }

    static async connect(){
        if(envConfig.DATASOURCE == 'localMongo'){
            await mongoose.connect(dbConfig.localMongodb.uri);
        }
        else if(envConfig.DATASOURCE == 'remoteMongo'){
            await mongoose.connect(dbConfig.remoteMongodb.uri);
        }        
    }

    static async disconnect(){
        await mongoose.disconnect();
    }

    async importInfo(filter = {}){
        try{
            const documents = await this.model.find(filter, {__v: 0, _id: 0}).lean();
            return documents;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async getById(elementId, source){
        try{
            let document = await this.model.findOne({ id: elementId}, {__v: 0,  _id: 0});
            if(source == 'carts'){                
                document = [document];
            }
            return document;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async save(newElement){
        try{
            const newDocument = new this.model(newElement);
            return await newDocument.save();
        }
        catch(error){
            console.log(error.message);
        }
    }

    async update(elementId, updatedElement){
        try{
            const updatedDocument = await this.model.updateOne(
                { id: elementId},
                {$set: { ...updatedElement }}
            );
            if(!updatedDocument.matchedCount){
                const errorMessage = `No se encuentra ningún producto con el ID ${elementId}.`
                throw new HttpError(HTTP_STATUS.NOT_FOUND, errorMessage);               
            };
            return updatedDocument;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async deleteById(elementId){
        try{
            return await this.model.deleteOne({ id: elementId});
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = MongoContainer;