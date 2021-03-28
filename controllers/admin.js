const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false
        });
}
exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;
    Product.create({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
    }).then(result => {
        console.log(result);
        res.redirect('/shop/products');
    }).catch(err => {
        console.log(err);
    });

    // const product = new Product(null, title, imageUrl, description, price);
    // product.save()
    //     .then(() => {
    //         res.redirect('/shop/products');
    //     })
    //     .catch(err => { console.log(err); });
}
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    if (editMode) {
        Product.findById(prodId, product => {
            if (!product) { return res.redirect('/') }
            return res.render('admin/edit-product',
                {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    editing: editMode,
                    product: product
                });
        })
    } else {
        res.redirect('/');
    }

}
exports.postEditProduct = (req, res, next) => {
    const { prodId, title: updatedTitle, imageUrl: updatedImageUrl, description: updatedDescription, price: updatedPrice } = req.body;

    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice)
    updatedProduct.save();
    res.redirect('/admin/products')
}
exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: "/admin/products"
        })
    });
}
exports.deleteProduct = (req, res, next) => {
    const { prodId } = req.body;
    Product.deleteById(prodId);
    res.redirect('/admin/products')
}