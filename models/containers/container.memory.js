const { v4: uuid } = require("uuid");

class MemoryContainer{
    constructor(elementsDefault, resource){
        this.elements = elementsDefault;
        this.resource = resource;
    }

    importInfo(){
        return this.elements;
    } 
    
    getById(id){
        let element = this.elements.filter(element => element._id == id);
        if(element == ''){
            element = false;
        }
        return element;   
    }

    save(element){
        const newElement = {
            _id: uuid(),
            ...element
        };
        this.elements.push(newElement);
        return this.elements;
    }

    update(id, updatedElement){
        const elementIndex = this.elements.findIndex(element => element._id == id);
        this.elements[elementIndex] = updatedElement;
    }

    deleteById(id){
        const elementIndex = this.elements.findIndex(element => element._id == id);
        this.elements.splice(elementIndex, 1);
        return this.elements;
    }
}

module.exports = MemoryContainer;