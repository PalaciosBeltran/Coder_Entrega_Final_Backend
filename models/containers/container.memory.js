class MemoryContainer{
    constructor(elementsDefault, resource){
        this.elements = elementsDefault;
        this.resource = resource;
    }

    importInfo(){
        try {
            return this.elements;
        }
        catch(error){
            console.log(error.message);
        }
    } 
    
    getById(id){
        try {
            let element = this.elements.filter(element => element.id == id);
            return element;
        }
        catch(error){
            console.log(error.message);
        }        
    }

    save(newElement){
        try {
            this.elements.push(newElement);
            return this.elements;
        }
        catch(error){
            console.log(error.message);
        }
    }

    update(id, updatedElement){
        try {
            const elementIndex = this.elements.findIndex(element => element.id == id);
            this.elements[elementIndex] = updatedElement;
        }
        catch(error){
            console.log(error.message);
        }
    }

    deleteById(id){
        try {
            const elementIndex = this.elements.findIndex(element => element.id == id);
            this.elements.splice(elementIndex, 1);
            return this.elements;
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = MemoryContainer;