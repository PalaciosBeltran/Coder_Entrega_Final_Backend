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
        const documents = await this.model.find(filter, {__v: 0}).lean();
        return documents;
    }

    async getById(elementId, source){
        let i = undefined;
        let document = undefined;
        try{
            document = await this.model.findOne({ _id: elementId}, {__v: 0});
        }
        catch{
            document = undefined;
            console.log(`No se encuentra ningún producto con el ID ${elementId}`);
        }
        return document;
    }

    async save(newElement){
        const newDocument = new this.model(newElement);
        return await newDocument.save();
    }

    async update(elementId, updatedElement){
        const updatedDocument = await this.model.updateOne(
            { _id: elementId},
            {$set: { ...updatedElement }}
        );
        return updatedDocument;
    }

    async deleteById(elementId, filter = {}){
        await this.model.deleteOne({ _id: elementId});
        return this.model.find(filter, {__v: 0}).lean();
    }
}

module.exports = MongoContainer;