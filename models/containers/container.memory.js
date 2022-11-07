class MemoryContainer{
    constructor(elementsDefault, resource){
        this.elements = elementsDefault;
        this.resource = resource;
    }

    async importInfo(){
        try {
            return this.elements;
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
            this.elements.push(newElement);
            return this.elements;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async update(elementIndex, updatedElement){
        try {
            this.elements[elementIndex] = updatedElement;
            return this.elements;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async deleteById(elementIndex){
        try {
            this.elements.splice(elementIndex, 1);
            return this.elements;
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = MemoryContainer;