const express = require('express');
const boydParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const { deleteById } = require('./models/productsMySQL');

//const database = require('./util/databaseMySQL');
const sequelize = require('./util/database');
const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-items');

const appExpress = express();

//template engine type of EJS
appExpress.set('view engine', 'ejs'); 
appExpress.set('views','views'); //the firts parameter is the folder default, the second parameters is where the html files are in the proyect 

//database connection
/* database.execute('SELECT * FROM products')
        .then(result => {

            console.log(result[0]);
        })
        .catch(err => {

            console.log("Database error", err);
        }); */

//middleware general
appExpress.use(boydParser.urlencoded({extended: false}));
appExpress.use(express.static(path.join(__dirname, 'public'))); //access to the public folder 


appExpress.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log("Error database - No user found", err);
        });
});


//middleware project
appExpress.use('/admin', adminRoutes);
appExpress.use(shopRoutes);
appExpress.use(errorController.get404Error);

//Sequelize
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }); //user who create the product 
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//sync with the database
//sequelize.sync({force: true}) //force true can to recreate the tables with the relationships
sequelize.sync()
        .then(result => {

           return User.findByPk(1);
        })
        .then(user => {

            if (!user){

                return User.create({ name: 'Angelica', email: 'test@test.com'});
            }
            return user;
        })
        .then(user => {

            return user.createCart();
        })
        .then(cart => {
            
            appExpress.listen(3000);
        })
        .catch(err => {

            console.log("Database connection failed", err);
        });