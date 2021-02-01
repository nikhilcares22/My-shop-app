const PORT = 3000;
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const app =express()

//template engine

app.set('view engine','ejs');
app.set('views','views');

//morgan
app.use(morgan(function(tokens,req,res){
    let pattern = new RegExp('^/css', 'i')
    let result = pattern.test(tokens.url(req,res))
    if(!result){
        return [
            tokens.method(req, res),
            tokens.url(req,res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
        ].join(' ');
    }
}))

//omit empty query or body
app.use(function(req,res,next){
    if (req.method == 'GET' && JSON.stringify(req.query) != JSON.stringify({})){
        console.log('Query',req.query)
    }
    else if (req.mothod == 'POST' || req.method == 'PUT' && JSON.stringify(req.body) != JSON.stringify({})){
        console.log('Body',req.body)
    }
    next();
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

//==============ROUTES=================
app.use('/admin',adminRoutes)
app.use('/shop',shopRoutes)

app.get('/',(req,res,next)=>{
    res.send('<h1>hello this is home page</h1>')
})

//==========ERROR CONTROLLER
app.use(errorController.get404)


app.listen(PORT, () => { console.log(`server running at ${PORT}`) })
