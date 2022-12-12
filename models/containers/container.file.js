const fs = require(`fs/promises`);
const fsConfig = require('../../databases/databases.config');
const { v4: uuid } = require("uuid");

class FileContainer{
    constructor(resource){
        this.resource = resource;
    }

    async importInfo(){
        let elements = [];
        if(this.resource == 'products'){
            elements = JSON.parse(await fs.readFile(fsConfig.file.products, `utf-8`))
        }
        else{
            elements = JSON.parse(await fs.readFile(fsConfig.file.carts, `utf-8`))
        }            
        return elements;
    } 
    
    async getById(id){
        let elements = await this.importInfo();
        let elementById = elements.filter(element => element._id == id);
        if(elementById == ''){
            elementById = false;
        }        
        return elementById;     
    }

    async save(newElement){
        let elements = await this.importInfo();
        newElement = {
            _id: uuid(),
            ...newElement
        }; 
        elements.push(newElement);
        if(this.resource == 'products'){
            await fs.writeFile(fsConfig.file.products, JSON.stringify(elements));
        }
        else{
            await fs.writeFile(fsConfig.file.carts, JSON.stringify(elements));
        }
    }

    async update(id, updatedElement){
        let elements = await this.importInfo();
        const elementIndex = elements.findIndex(element => element._id == id);
        elements[elementIndex] = updatedElement;
        if(this.resource == 'products'){
            await fs.writeFile(fsConfig.file.products, JSON.stringify(elements));
        }
        else{
            await fs.writeFile(fsConfig.file.carts, JSON.stringify(elements));
        }
    }

    async deleteById(id){
        let elements = await this.importInfo();
        const elementIndex = elements.findIndex(element => element._id == id);
        elements.splice(elementIndex, 1);
        if(this.resource == 'products'){
            await fs.writeFile(fsConfig.file.products, JSON.stringify(elements));
        }
        else{
            await fs.writeFile(fsConfig.file.carts, JSON.stringify(elements));
        }
        return elements;
    }
}

module.exports = FileContainer;