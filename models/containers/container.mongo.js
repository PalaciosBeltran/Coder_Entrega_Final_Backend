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
        console.log(envConfig.DATASOURCE);
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

    async getById(elementIndex){
        try{
            const document = await this.model.findOne({ id: elementIndex+1}, {__v: 0,  _id: 0});
            if(!document){
                const errorMessage = `No se encuentra ningún producto con el Id ${elementIndex}.`
                throw new HttpError(HTTP_STATUS.NOT_FOUND, errorMessage);
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

    async update(elementIndex, updatedElement){
        try{
            const updatedDocument = await this.model.updateOne(
                { id: elementIndex+1},
                {$set: { ...updatedElement }}
            );
            if(!updatedDocument.matchedCount){
                const errorMessage = `No se encuentra ningún producto con el Id ${elementIndex}.`
                throw new HttpError(HTTP_STATUS.NOT_FOUND, errorMessage);               
            };
            return updatedDocument;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async deleteById(elementIndex){
        try{
            return await this.model.deleteOne({ id: elementIndex+1});
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = MongoContainer;