const database = require('../util/databaseMySQL');

module.exports = class Product {

    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    };

    save(){

        return database.execute(
            'INSERT INTO products (title, description, price, imageUrl) VALUES (?, ?, ?, ?)',
            [this.title, this.description, this.price, this.imageUrl]
            );        
    };

    static deleteById(id){

        
    };

    static fetchAllProducts(){
        
        return database.execute('SELECT * FROM products');
    };

    static findProductById(id){

        return database.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    };
};