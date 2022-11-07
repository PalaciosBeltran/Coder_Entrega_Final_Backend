const fs = require(`fs/promises`);

class FileContainer{
    constructor(fileName, resource){
        this.fileName = fileName;
        this.resource = resource;
    }

    async importInfo(){
        try {
            let elements = JSON.parse(await fs.readFile(`./databases/file/${this.resource}/${this.fileName}`, `utf-8`));
            return elements;
        }
        catch(error){
            console.log(error.message);
        }
    } 
    
    async getById(elementIndex){
        try {
            let elements = await this.importInfo();          
            return elements[elementIndex];
        }
        catch(error){
            console.log(error.message);
        }        
    }

    async save(newElement){
        try {
            let elements = await this.importInfo();
            elements.push(newElement);
            await fs.writeFile(`./databases/file/${this.resource}/${this.fileName}`, JSON.stringify(elements));
        }
        catch(error){
            console.log(error.message);
        }
    }

    async update(elementIndex, updatedElement){
        try {
            let elements = await this.importInfo();
            elements[elementIndex] = updatedElement;
            await fs.writeFile(`./databases/file/${this.resource}/${this.fileName}`, JSON.stringify(elements));
        }
        catch(error){
            console.log(error.message);
        }
    }

    async deleteById(elementIndex){
        try {
            let elements = await this.importInfo();
            elements.splice(elementIndex, 1);
            await fs.writeFile(`./databases/file/${this.resource}/${this.fileName}`, JSON.stringify(elements));
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = FileContainer;