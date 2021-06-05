//const Product = require('../models/productsMySQL');
const Product = require('../models/products');
//const Cart = require('../models/cartMySQL');

exports.getProducts = (req, res, next) => {

    Product.findAll()
    .then(products => {
        res.render('shop/product-list', 
        {
            prods: products, 
            docTitle: 'All Products', 
            path: "/procuts"
        }); 
    })
    .catch(err => {
        console.log("Data base error - Prodcuts not found", err);
    });
    
    /* Product.fetchAllProducts()
            .then(([products]) => {
             
               res.render('shop/product-list', 
                {
                    prods: products, 
                    docTitle: 'All Products', 
                    path: "/procuts"
                }); 
            })
            .catch( err => {
                console.log("Data base error - Prodcuts not found", err);
            }); */
};

exports.getProduct = (req, res, next) => {

    const prodId = req.params.productId;
    
    Product.findAll({ where: { id : prodId } })
            .then(product => {

                res.render('shop/product-detail', 
                {
                    product: product[0],
                    docTitle: 'Product Detail - ' + product[0].title,
                    path: '/products'
                });
            })
            .catch(err => {
                console.log('Data base error - Product detail not found', err);
            });


    /* Product.findByPk(prodId)
            .then((product) => {

                res.render('shop/product-detail', 
                {
                    product: product,
                    docTitle: 'Product Detail - ' + product.title,
                    path: '/products'
                });
            })
            .catch(err => {
                console.log('Data base error - Product detail not found', err);
            }); */

    /* Product.findProductById(prodId)
            .then(([product]) => {

                res.render('shop/product-detail', 
                {
                    product: product[0],
                    docTitle: 'Product Detail - ' + product.title,
                    path: '/products'
                });
            })
            .catch(err => {
                console.log('Data base error - Product detail not found', err);
            }); */
};

exports.getIndex = (req, res, next) => {

    Product.findAll()
            .then(products => {
                res.render('shop/index', 
                {
                    prods: products, 
                    docTitle: 'Shop', 
                    path: "/"
                }); 
            })
            .catch(err => {
                console.log("Data base error - Prodcuts not found", err);
            });

    /* Product.fetchAllProducts()
            .then(([products]) => {
             
                res.render('shop/index', 
                {
                    prods: products, 
                    docTitle: 'Shop', 
                    path: "/"
                }); 
            })
            .catch( err => {
                console.log("Data base error - Prodcuts not found");
            }); */
};

exports.postDeleteProductCart = (req, res, next) => {

    const prodId = req.body.productId;

    req.user.getCart()
            .then(cart => {
                return cart.getProducts({ where: { id:prodId } });
            })
            .then(products => {

                const product = products[0];
                return product.cartItem.destroy();
            })
            .then(result => {

                res.redirect('/cart');
            })
            .catch(err => {
                console.log("Database error - The product cannot be deleted");
            });

    /* Product.findProductById(prodId, product => {

        Cart.deleteProductCart(prodId, product.price);
        res.redirect('/cart');
    }); */
};

exports.getCart = (req, res, next) => {

    req.user.getCart()
            .then(cart => {

                return cart.getProducts()
                        .then(products => {

                            res.render('shop/cart', 
                            {
                                docTitle: 'Your cart',
                                path: '/cart',
                                products: products
                            });
                        })
                        .catch(err => {
            
                            console.log("Database error - Products in Cart not found", err);
                        });
            })
            .catch(err => {
            
                console.log("Database error - Cart not found", err);
            });

   /*  Cart.getProductsCart(cart => {
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
    }); */
};

exports.postCart = (req, res, next) => {

    const prodId = req.body.productId;  //name input on the body
    let fetchedCart; 
    let newQuantity = 1;

    req.user.getCart()
            .then(cart => {

                fetchedCart = cart;
                return cart.getProducts({ where: { id: prodId } });
            })
            .then(products => {

                let product;
                if (products.length > 0){

                    product = products[0];
                }
                
                if (product){
                    
                    const oldQuantity = product.cartItem.quantity;
                    newQuantity = oldQuantity + 1;
                    return product;
                }

                return Product.findByPk(prodId);
            })
            .then(product => {

                return fetchedCart.addProduct(product, {
                    through: { quantity: newQuantity }
                });
            })
            .then(() => {
                res.redirect('/cart');
            })
            .catch(err => {

                console.log("Error database - The product was not possible added to the cart");
            });

    /* Product.findProductById(prodId, (product) => {
        Cart.addProudctCart(prodId, product.price);
    });
    res.redirect('/cartOld'); */
};

exports.postOrder = (req, res, next) => {

    let productList;
    let fetchedCart;

    req.user.getCart()
            .then(cart => {
                
                fetchedCart = cart;
                return cart.getProducts(); 
            })
            .then(products => {

                productList = products;
                return req.user.createOrder();
            })
            .then(order => {

                order.addProducts(productList.map(product => {
                    //orderItem the name in the model
                    product.orderItem = { quantity: product.cartItem.quantity };
                    return product;
                }));
            })
            .then(() => {

                return fetchedCart.setProducts(null); 
            })
            .then(() => {

                res.redirect('/orders');
            })
            .catch(err => {

                console.log("Database error - The order failed", err);
            });
};

exports.getOrders = (req, res, next) => {

    req.user.getOrders({ include: ['products'] })   //products the name in the model
            .then(orders => {

                res.render('shop/orders', 
                {
                    docTitle: 'Your orders',
                    path: '/orders',
                    orders: orders
                });
            })
            .catch(err => {
                
                console.log("Database error - Orders not found", err);
            });
};

