const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const pathFolder = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = cb => {

    fs.readFile(pathFolder, (err, fileContent) => {

        if (err){

            cb([]);

        } else {

            cb(JSON.parse(fileContent));
        };
    });
};

module.exports = class Product {

    constructor(id, titleProduct, imageUrl, description, price) {
        this.id = id;
        this.title = titleProduct;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    };

    save(){

        getProductsFromFile(products => {

            if (this.id){

                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updateProducts = [...products];
                updateProducts[existingProductIndex] = this;

                fs.writeFile(pathFolder, JSON.stringify(updateProducts), (err) => {

                    console.log("Error product updated=", err);
                });

            } else {

                this.id = Math.random().toString();
                products.push(this);

                fs.writeFile(pathFolder, JSON.stringify(products), (err) => {
    
                    console.log("Error proudc created=", err);
    
                });
            };
        });
    };

    static deleteById(id){

        getProductsFromFile(products => {

            const product = products.findIndex(prod => prod.id !== id); 

            const existingProductIndex = products.filter(prod => prod.id !== id); //create a new array with the filter result

            fs.writeFile(pathFolder, JSON.stringify(existingProductIndex), (err) => {
    
                if (err){
                    console.log("Error proudct deleted=", err);

                } else {

                    Cart.deleteProductCart(id, product.price);
                };
            });
        });
    };

    static fetchAllProducts(cb){
        //the cb (callback) is for the function return something because the code is async 
        getProductsFromFile(cb);
    };

    static findProductById(id, cb){

        getProductsFromFile(products => {

            const product = products.find(p => p.id === id);
            cb(product);

        });
    };
};