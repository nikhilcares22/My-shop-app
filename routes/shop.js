const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shop')

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', shopController.getCart)

router.get('/cartDeleteitem', shopController.postCartDelete)

router.post('/create-order', shopController.postOrder)

router.post('/cart', shopController.postCart)

router.get('/orders', shopController.getOrders)

module.exports = router