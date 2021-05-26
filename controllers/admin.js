const Product = require('../models/products');


exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product',
                {
                    docTitle: 'Add Product', 
                    path: '/admin/add-product',
                    editing: false
                });
};

exports.postAddProduct =  (req, res, next) => {
 
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {

    const editMode = req.query.edit;
   
    if (!editMode) {
        return res.redirect('/');
    };

    const prodId = req.params.productId;
 
    Product.findProductById(prodId, (product) => {
        
        if (!product){
            return res.redirect('/');
        };

        res.render('admin/edit-product',
                {
                    docTitle: 'Edit Product', 
                    path: '/admin/edit-product',
                    editing: editMode,
                    product: product
                });
    });
};

exports.postEditProducts = (req, res, next) => {

    const prodId = req.body.productId;  //name input
    
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {

    Product.fetchAllProducts(products => {

        res.render('admin/products', 
                {
                    prods: products, 
                    docTitle: 'Admin Products', 
                    path: "/admin/products"
                }); 
    });

};

exports.postDeteleProduct = (req, res, next) => {

    const prodId = req.body.productId;
    console.log("delete id= ", prodId);
    Product.deleteById(prodId);
    res.redirect("/admin/products");
};