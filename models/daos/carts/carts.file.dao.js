const fs = require(`fs/promises`);
const resource = 'carts';
const FileContainer = require("../../containers/container.file");
const fsConfig = require('../../../databases/databases.config');

class CartsFileDao extends FileContainer {
    constructor(){
        super(resource);
    }

    async deleteProductsByCartId(cartIndex, productIndex){
        try{
            const carts = await this.importInfo();
            carts[cartIndex].products.splice(productIndex, 1);
            if(this.resource == 'carts'){
                await fs.writeFile(fsConfig.file.carts, JSON.stringify(carts));
            }
        }
        catch(error){
            console.log(error.message);
        }
    }
}

module.exports = CartsFileDao;