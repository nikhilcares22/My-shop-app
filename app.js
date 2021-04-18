const PORT = 3000;
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const csrf = require('csurf')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const MongoDbStore = require('connect-mongodb-session')(session)

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user')
const dbConnect = require('./utils/database');

dbConnect()
const MONGODB_URI = 'mongodb://localhost:27017/shop'
const app = express()
const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: "sessions"
})

const csrfProtection = csrf({ cookie: true });
//template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//temp auth user
app.use(function (req, res, next) {
    User.findOne({})
        .then(user => {
            req.user = user;
            next()
        })
        .catch(err => {
            console.log(err)
        })
});

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

app.use(session({
    secret: 'mysecreteskdkddkdkd',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrfProtection)
app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
    if (req.session.user) {
        User.findById('60695f3e48e70f3094ac7be6')
            .then(user => {
                req.session.user = user;
                next();
            }).catch(err => {
                console.log(err);
            })
    }
    else {
        return next()
    }
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    let token = req.csrfToken()
    res.locals.csrfToken = token
    next()
})
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


//==============ROUTES=================
app.use('/admin', adminRoutes)
app.use('/shop', shopRoutes)
app.use('/auth', authRoutes)

app.get('/', (req, res, next) => {
    res.send('<h1>hello this is home page</h1>')
})

//==========ERROR CONTROLLER=============
app.use(errorController.get404)

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})