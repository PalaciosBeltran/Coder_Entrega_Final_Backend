const fs = require(`fs/promises`);
const fsConfig = require('../../databases/databases.config');

class FileContainer{
    constructor(resource){
        this.resource = resource;
    }

    async importInfo(){
        try {
            let elements = [];
            if(this.resource == 'products'){
                elements = JSON.parse(await fs.readFile(fsConfig.file.products, `utf-8`))
            }
            else{
                elements = JSON.parse(await fs.readFile(fsConfig.file.carts, `utf-8`))
            }            
            return elements;
        }
        catch(error){
            console.log(error.message);
        }
    } 
    
    async getById(id){
        try {
            let elements = await this.importInfo();          
            let elementById = elements.filter(element => element.id == id);
            return elementById;
        }
        catch(error){
            console.log(error.message);
        }        
    }

    async save(newElement){
        try {
            let elements = await this.importInfo();
            elements.push(newElement);
            if(this.resource == 'products'){
                await fs.writeFile(fsConfig.file.products, JSON.stringify(elements));
            }
            else{
                await fs.writeFile(fsConfig.file.carts, JSON.stringify(elements));
            }
        }
        catch(error){
            console.log(error.message);
        }
    }

    async update(id, updatedElement){
        try {
            let elements = await this.importInfo();
            const elementIndex = elements.findIndex(element => element.id == id);
            elements[elementIndex] = updatedElement;
            if(this.resource == 'products'){
                await fs.writeFile(fsConfig.file.products, JSON.stringify(elements));
            }
            else{
                await fs.writeFile(fsConfig.file.carts, JSON.stringify(elements));
            }
        }
        catch(error){
            console.log(error.message);
        }
    }

    async deleteById(id){
        try {
            let elements = await this.importInfo();
            const elementIndex = elements.findIndex(element => element.id == id);
            elements.splice(elementIndex, 1);
            if(this.resource == 'products'){
                await fs.writeFile(fsConfig.file.products, JSON.stringify(elements));
            }
            else{
                await fs.writeFile(fsConfig.file.carts, JSON.stringify(elements));
            }
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = FileContainer;