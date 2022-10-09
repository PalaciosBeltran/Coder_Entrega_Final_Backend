const fs = require(`fs/promises`);

class Products{
    constructor(fileName){
        this.fileName = fileName;
    }

    async importInfo(){
        try {
            let products = JSON.parse(await fs.readFile(`./data/products/${this.fileName}`, `utf-8`));
            return products;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async getById(productIndex){
        try {
            let products = await this.importInfo();          
            return products[productIndex];
        }
        catch(error){
            console.log(error.message);
        }        
    }

    async save(newProduct){
        try {
            let products = await this.importInfo();
            products.push(newProduct);
            await fs.writeFile(`./data/products/${this.fileName}`, JSON.stringify(products));
            products = await this.importInfo();
            return products;
        }
        catch(error){
            console.log(error.message);
        }
    }

    async update(productIndex, updatedProduct){
        try {
            let products = await this.importInfo();
            products[productIndex] = updatedProduct;
            await fs.writeFile(`./data/products/${this.fileName}`, JSON.stringify(products));
            products = await this.importInfo();
            return products;
        }
        catch(error){
            console.log(error.message);
        }
    }

  async deleteById(productIndex){
        try {
            let products = await this.importInfo();
            products.splice(productIndex, 1);
            await fs.writeFile(`./data/products/${this.fileName}`, JSON.stringify(products));
            products = await this.importInfo();
            return products;
        }
        catch(error){
            console.log(error.message);
        }
  }
}

module.exports = Products;