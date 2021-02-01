const fs = require('fs')
const path = require('path')
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
const getProductsFromFile = cb => {
    fs.readFile(p,'utf8', (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        if(fileContent.length==0){return cb([])}
        cb(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            console.log('sadasdjsadj',products);
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => {
                console.log(error);
            })
        })
    }
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    } 
}