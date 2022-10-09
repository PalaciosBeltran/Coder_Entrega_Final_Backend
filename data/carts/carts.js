const fs = require(`fs/promises`);

class ShoppingCart{
    constructor(fileName){
        this.fileName =fileName;
    }

    async importInfo(){
        try {
            const cart = JSON.parse(await fs.readFile(`./data/carts/${this.fileName}`, `utf-8`));
            return cart;
        }
        catch(error){
            console.log(error.message);
        }
    }
    
    async getProductsByCartId(cartIndex){
        try {
            const carts = await this.importInfo();          
            return carts[cartIndex].products;
        }
        catch(error){
            console.log(error.message);
        }        
    } 
    
    async deleteCartById(cartIndex){
        try{
            const carts = await this.importInfo();
            carts.splice(cartIndex, 1);
            await fs.writeFile(`./data/carts/${this.fileName}`, JSON.stringify(carts));   
        }
        catch(error){
            console.log(error.message);
        }
    }  
    
    async save(newCart){
        try {
            const carts = await this.importInfo();
            carts.push(newCart);
            await fs.writeFile(`./data/carts/${this.fileName}`, JSON.stringify(carts));
        }
        catch(error){
            console.log(error.message);
        }
    }

    async updateProducts(cartIndex, currentCart){
        try{
            const carts = await this.importInfo();
            carts[cartIndex] = currentCart;
            await fs.writeFile(`./data/carts/${this.fileName}`, JSON.stringify(carts));            
        }
        catch(error){
            console.log(error.message);
        }
    }

    async deleteProductsByCartId(cartIndex, productIndex){
        try{
            const carts = await this.importInfo();
            carts[cartIndex].products.splice(productIndex, 1);
            await fs.writeFile(`./data/carts/${this.fileName}`, JSON.stringify(carts));   
        }
        catch(error){
            console.log(error.message);
        }
    }


}

module.exports = ShoppingCart;