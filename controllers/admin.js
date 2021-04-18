const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
        });
}
exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;
    const userId = req.user.id
    const product = new Product({
        title, imageUrl, description, price, userId
    })
    product.save()
        .then(result => {
            res.redirect('/shop/products');
        })
        .catch(err => {
            console.log(err)
        })
}
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    if (editMode) { 
        // req.user.getProducts({ where: { id: prodId } })
        Product.findById(prodId)
            .then(products => {
                const product = products
                if (!product) { return res.redirect('/') }
                return res.render('admin/edit-product',
                    {
                        pageTitle: 'Edit Product',
                        path: '/admin/edit-product',
                        editing: editMode,
                        product: product,
                    });
            })
            .catch(err => { console.log(err); })
    } else {
        res.redirect('/');
    }

}
exports.postEditProduct = (req, res, next) => {
    const { prodId, title: updatedTitle, imageUrl: updatedImageUrl, description: updatedDescription, price: updatedPrice } = req.body;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle
            product.imageUrl = updatedImageUrl
            product.description = updatedDescription
            product.price = updatedPrice
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err);
        })
}
exports.getProducts = (req, res, next) => {
    Product.find()
        .populate('userId')
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: "/admin/products",
            })
        })
        .catch(err => {
            console.log(err);
        })
}
exports.deleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findByIdAndDelete(productId)
        .then(result => {
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err);
        })
}