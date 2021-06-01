const Product = require('../models/products');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    
    Product.fetchAllProducts()
            .then(([rows]) => {

               console.log(rows);
               
               res.render('shop/product-list', 
                {
                    prods: rows, 
                    docTitle: 'All Products', 
                    path: "/procuts"
                }); 
            })
            .catch( err => {
                console.log("Data base error - Prodcuts not found");
            });
};

exports.getProduct = (req, res, next) => {

    const prodId = req.params.productId;
    Product.findProductById(prodId, product => {

        res.render('shop/product-detail', 
                    {
                        product: product,
                        docTitle: 'Product Detail - ' + product.title,
                        path: '/products'
                    });
    });
};

exports.getIndex = (req, res, next) => {

    Product.fetchAllProducts()
            .then(([rows]) => {

               console.log(rows);
               
                res.render('shop/index', 
                {
                    prods: rows, 
                    docTitle: 'Shop', 
                    path: "/"
                }); 
            })
            .catch( err => {
                console.log("Data base error - Prodcuts not found");
            });
};

exports.getCart = (req, res, next) => {

    Cart.getProductsCart(cart => {
        Product.fetchAllProducts(products => {

            const cartProducts = [];
            for (product of products){

                const cartProductData = cart.products.find(prod => prod.id === product.id);

                if (cartProductData){

                    cartProducts.push({ productData: product, quantity: cartProductData.quantity });
                };
            };

            res.render('shop/cart', 
            {
                docTitle: 'Your cart',
                path: '/cart',
                products: cartProducts
            });
        });
    });
};

exports.postCart = (req, res, next) => {

    const prodId = req.body.productId;  //name input on the body 
    Product.findProductById(prodId, (product) => {
        Cart.addProudctCart(prodId, product.price);
    });
    res.redirect('/cart');
};

exports.getChekout = (req, res, next) => {

    res.render('shop/checkout', 
    {
        docTitle: 'Checkout',
        path: '/checkout'
    });
};

exports.getOrders = (req, res, next) => {

    res.render('shop/orders', 
    {
        docTitle: 'Your orders',
        path: '/orders'
    });
};

exports.postDeleteProductCart = (req, res, next) => {

    const prodId = req.body.productId;

    Product.findProductById(prodId, product => {

        Cart.deleteProductCart(prodId, product.price);
        res.redirect('/cart');
    });
};