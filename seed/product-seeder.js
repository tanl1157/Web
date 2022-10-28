var Product = require('../models/product');

var mongoose = require('mongoose');
const { exists } = require('../models/product');

mongoose.connect('localhost:27017/shopping');

var products = [
    new Product({
        imagePath:''  ,
        title: ''  ,
        description: '',
        price:10
}),
];

var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        done++;
        if (done === products.length){
            exist();
        }
    });
}

function exist(){
    mongoose.disconnect();
}
