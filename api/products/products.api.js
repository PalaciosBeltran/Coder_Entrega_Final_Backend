const Products = require('../../data/products/products');
const importedProducts = new Products('products.json');

const getProducts = async (req, res) => {
    const { maxPrice, search } = req.query;
    const products = await importedProducts.importInfo();
    if (Object.keys(req.query).length > 0) {
      if (maxPrice) {
        if (isNaN(+maxPrice)) {
          return res.status(400).json({success: false, error: `Error ${res.statusCode}: El precio máximo proporcionado no es correcto. Verificar que el número sea un valor válido.`});
        }
        products = products.filter(product => product.price <= +maxPrice);
      }
      if (search) {
        products = products.filter(product => product.name.toLowerCase().startsWith(search.toLowerCase()))
        if(products.length == 0){
          return res.status(400).json({success: false, error: `Error ${res.statusCode}: No se encontraron productos con el nombre ${search}.`});
        }
      }
      return res.json({success: true, result: products });
    }
    return res.json({success: true, result: products });
}

const searchProduct = async (req, res) =>{
    const products = await importedProducts.importInfo();
    const productIndex = products.findIndex(product => product.id === +req.params.id);
    if (productIndex < 0) {
      return res.status(404).json({ success: false, error: `Error ${res.statusCode}: No se encuentra ningún producto con el Id ${req.params.id}.`});
    }
    return productIndex; 
}

const getProductByID = async (req, res) => {
    const productIndex = await searchProduct(req, res);
    const productByID = await importedProducts.getById(productIndex);
    return res.json({ success: true, result: productByID });
}

const saveNewProduct = async (req, res) => {
    const products = await importedProducts.importInfo();
    const { user } = req.query;
    if(user == 'admin'){
      const { name, description, code, thumbnail, price, stock } = req.body;
      if ( !name || !description || !code || !thumbnail || !price || !stock ) {
        return res.status(400).json({ succes: false, error: `Error ${res.statusCode}: El formato proporcionado no es correcto. Verificar los campos introducidos.` });
      }
      const newProduct = {      
        id: products.length + 1,
        productTimestamp: Date.now(),
        name,
        description,
        code,
        thumbnail,
        price,
        stock
      };
      const updatedProducts = await importedProducts.save(newProduct);
      res.json({ success: true, result: updatedProducts });
    }
    else{
      return res.status(404).json({ success: false, error: -1, description: `Error ${res.statusCode}: Permiso inválido. El método ${req.method} para la ruta ${req.baseUrl} solo puede ser ejecutado por un administrador autorizado.`})
    }

}

const updateCurrentProduct = async (req, res) => {
    const products = await importedProducts.importInfo();
    const productId = req.params.id;
    const { user } = req.query;
    if(user == 'admin'){
      const { name, description, code, thumbnail, price, stock } = req.body;
      if ( !name || !description || !code || !thumbnail || !price || !stock ) {
        return res.status(400).json({ success: false, error: `Error ${res.statusCode}: El formato proporcionado no es correcto. Verificar los campos introducidos.` });
      };
      const productIndex = await searchProduct(req, res);
      if(productIndex >= 0){
        const updatedProduct = {
          ...products[productIndex],
          productTimestamp: Date.now(),
          name,
          description,
          code,
          thumbnail,
          price,
          stock
        };
        const updatedProducts = await importedProducts.update(productIndex, updatedProduct);
        res.json({ success: true, result: updatedProducts });
      }
    }
    else{
      return res.status(404).json({ success: false, error: -1, description: `Error ${res.statusCode}: Permiso inválido. El método ${req.method} para la ruta ${req.baseUrl} solo puede ser ejecutado por un administrador autorizado.`})
    }
}

const deleteProduct = async (req, res) => {
    const { user } = req.query;
    if(user == 'admin'){
      const productIndex = await searchProduct(req, res);
      if(productIndex >= 0){
        const updatedProducts = await importedProducts.deleteById(productIndex);
        res.json({ success: true, result: updatedProducts });
      }
    }
    else{
      return res.status(404).json({ success: false, error: -1, description: `Error ${res.statusCode}: Permiso inválido. El método ${req.method} para la ruta ${req.baseUrl} solo puede ser ejecutado por un administrador autorizado.`})
    }
}

const productsApi = { getProducts, getProductByID, saveNewProduct, updateCurrentProduct, deleteProduct};
module.exports = productsApi;
