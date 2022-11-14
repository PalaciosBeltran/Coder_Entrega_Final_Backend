const resource = 'products';
const FileContainer = require("../../containers/container.file");

class ProductsFileDao extends FileContainer {
    constructor(){
        super(resource);
    }
}

module.exports = ProductsFileDao;