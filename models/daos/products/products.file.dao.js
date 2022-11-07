const resource = 'products';
const fileName = 'products.json';
const FileContainer = require("../../containers/container.file");

class ProductsFileDao extends FileContainer {
    constructor(){
        super(fileName, resource);
    }
}

module.exports = ProductsFileDao;