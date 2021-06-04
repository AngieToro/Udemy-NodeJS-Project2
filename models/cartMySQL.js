const fs = require('fs');
const path = require('path');

const pathFolder = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {

    static addProudctCart (id, productPrice){

        //Fetch the previous cart
        fs.readFile(pathFolder, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            
            if (!err){
                cart = JSON.parse(fileContent);
            };

            //Analyze the cart -> Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updateProduct;

            //add a new product, increase quantity
            if (existingProduct) {  //replace the item
                updateProduct = {...existingProduct};
                updateProduct.quantity = updateProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updateProduct;

            } else{ //add the item
                updateProduct = 
                    { 
                        id: id,
                        quantity: 1
                    };
                cart.products = [...cart.products, updateProduct];
            };

            cart.totalPrice = cart.totalPrice + +productPrice;
            
            fs.writeFile(pathFolder, JSON.stringify(cart), err => {

                console.log("Error add product cart= ", err);
            });
        });
    };

    static deleteProductCart(id, productPrice){

        fs.readFile(pathFolder, (err, fileContent) => {

            if (err) {
                return;
            };

            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id === id);

            if (!product){
                return;
            };

            const productQuantity = product.quantity;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQuantity;

            fs.writeFile(pathFolder, JSON.stringify(updatedCart), err => {

                console.log("Error delete product cart= ", err);
            });
        });
    };

    static getProductsCart(cb) {

        fs.readFile(pathFolder, (err, fileContent) => {
        
            const cart= JSON.parse(fileContent);
            
            if (err){
                cb(null);
            
            } else {
                cb(cart);
            };
        });
    };
};