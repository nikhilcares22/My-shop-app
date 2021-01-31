const fs = require('fs')
const path = require('path')
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
const getProductsFromFiles = cb => {
    fs.readFile(p,'utf8', (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        if(fileContent.length==0){return cb([])}
        cb(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFiles(products => {
            console.log('sadasdjsadj',products);
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => {
                console.log(error);
            })
        })
    }
    static fetchAll(cb) {
        getProductsFromFiles(cb);
    }
}