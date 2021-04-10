const Product = require('../models/product')
const Order = require('../models/order');
const order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: "/products"
      })
    })
    .catch(err => {
      console.log(err);
    });
}
exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-detail',
        {
          path: '/products',
          product: product,
          pageTitle: 'Product Details'
        })
    })
    .catch(err => { console.log(err) })
}
exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: "/"
      })
    })
    .catch(err => {
      console.log(err);
    });
}
exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId').execPopulate()
    .then(user => {
      const products = user.cart.items
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      })
    }).catch(err => {
      console.log(err);
    })
}
exports.postCart = (req, res, next) => {
  const { productId: prodId } = req.body;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result)
      res.redirect('/shop/cart')
    })
    .catch(err => {
      console.log(err);
    })
}
exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }
        }
      })
      const order = new Order({
        user: {
          userId: req.user._id,
          name: req.user.name,
        },
        products: products
      })
      return order.save()
    })
    .then(result => {
      return req.user.clearCart()
    })
    .then(result => {
      res.redirect('/shop/orders')
    })
    .catch(err => {
      console.log(err);
    })
}
exports.getOrders = (req, res, next) => {
  const userId = req.user._id
  Order.find({ "user.userId": userId })
  .then(orders => {
    console.log('orderss==', orders);
    // const products = orders.map(i => i.products)
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    })
  })
    .catch(err => {
      console.log(err);
    })
}
exports.postCartDelete = (req, res, next) => {
  const { prodId } = req.query;
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/shop/cart')
    })
    .catch(err => {
      console.log(err);
    })
}

Array.prototype.sort