const PORT = 3000;
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const sequelize = require('./utils/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-items')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const app = express()

//template engine

app.set('view engine', 'ejs');
app.set('views', 'views');

//morgan
app.use(morgan(function (tokens, req, res) {
    let pattern = new RegExp('^/css', 'i')
    let result = pattern.test(tokens.url(req, res))
    if (!result) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
        ].join(' ');
    }
}))

//omit empty query or body
app.use(function (req, res, next) {
    if (req.method == 'GET' && JSON.stringify(req.query) != JSON.stringify({})) {
        console.log('Query', req.query)
    }
    else if (req.mothod == 'POST' || req.method == 'PUT' && JSON.stringify(req.body) != JSON.stringify({})) {
        console.log('Body', req.body)
    }
    next();
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next();
        })
        .catch(err => {
            console.log(err);
        })
})

//==============ROUTES=================
app.use('/admin', adminRoutes)
app.use('/shop', shopRoutes)

app.get('/', (req, res, next) => {
    res.send('<h1>hello this is home page</h1>')
})

//==========ERROR CONTROLLER=============
app.use(errorController.get404)

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize.sync()
    // sequelize.sync({ force: true })
    .then(result => {
        return User.findByPk(1)
        // console.log(result);
    })
    .then(user => {
        if (!user) return User.create({ name: 'Nikhil', email: 'nikhil123@gmail.com' })
        return user
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(PORT, () => { console.log(`server running at ${PORT}`) })
    })
    .catch(err => {
        console.log(err);
    })

