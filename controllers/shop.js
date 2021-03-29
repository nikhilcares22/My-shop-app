const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findByPk(productId)
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
  Product.findAll()
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
    .getCart()
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          })
        })
        .catch(err => { console.log(err); })
    })
    .catch(err => {
      console.log(err);
    })
}
exports.postCart = (req, res, next) => {
  const { productId: prodId } = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      let product
      if (products.length > 0) {
        product = products[0]
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then(() => {
      res.redirect('/shop/cart')
    })
    .catch(err => { console.log(err); })
}
exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = {
              quantity: product.cartItem.quantity
            }
            return product;
          }))
        })
        .then(result => {
          return fetchedCart.setProducts(null)
        })
        .then(result => {
          res.redirect('/shop/orders')
        })
        .catch(err => { console.log(err); })
    })
    .catch(err => { console.log(err); });
}
exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      orders.map(order => {
        console.log(order.products);
      });
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
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0];
      console.log('prosucts==', product.cartItem);
      return product.cartItem.destroy()
    })
    .then(result => {
      res.redirect('cart');
    })
    .catch(err => {
      console.log(err);
    })
}
