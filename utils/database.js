const mongoose = require('mongoose')
global.ObjectId = mongoose.Types.ObjectId
const mongoConnect = () => {
    mongoose.connect('mongodb://localhost:27017/shop', {
        useNewUrlParser: true, useUnifiedTopology: true
    })
        .then(result => {
            console.log('Connected to the database')
        })
        .catch(err => {
            throw err;
        })
}

module.exports = mongoConnect;