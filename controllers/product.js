const Product = require('../models/product')
exports.getAddProduct = (req, res, next) => {
  res.render('add-product',
    {
      pageTitle: 'Add Product',
      path: '/product',
      formCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
}
exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  console.log(product);
  product.save();
  res.redirect('/shop');
}

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop', {
      prods: products, pageTitle: 'Shop', path: "/shop", hasProducts: products.length > 0,
      activeShop: true, productCSS: true
    })
  });
}

