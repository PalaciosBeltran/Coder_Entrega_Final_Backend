const fs = require(`fs/promises`);
const resource = 'carts';
const fileName = 'carts.json';
const FileContainer = require("../../containers/container.file");

class CartsFileDao extends FileContainer {
    constructor(){
        super(fileName, resource);
    }

    async deleteProductsByCartId(cartIndex, productIndex){
        try{
            const carts = await this.importInfo();
            carts[cartIndex].products.splice(productIndex, 1);
            await fs.writeFile(`./databases/file/${this.resource}/${this.fileName}`, JSON.stringify(carts));   
        }
        catch(error){
            console.log(error.message);
        }
    }

}

module.exports = CartsFileDao;