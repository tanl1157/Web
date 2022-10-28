const express = require('express');
const cart = require('../models/cart');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');





/* GET home page. */
router.get('/', function(req, res, next) {
  const successMsg = req.flash('success')[0];
  Product.find(function(err, docs){
    const productChunks = [];
    const chunkSize = 3;
    for (const i = 0;i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
  
});

router.get('/add-to-cart/:id', function(req, res, next){
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if (err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req,res,next){
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
})

router.get('/remove/:id', function(req,res,next){
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
})

router.get('/shopping-cart', function(req, res, next){
  if (!req.session.cart){
    return res.render('shop/shopping-cart', {products: null});
  }
  const cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {product: cart.generateArray(), totalPrice: cart.totalPrice});

});

router.get('/checkout', function(req, res, next){
  if (!req.session.cart){
    return res.render('/shopping-cart');
  }
    const cart = new Cart(req.session.cart);
    const errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMSg})

});

router.post('/checkout', function(req, res, next){
  if (!req.session.cart){
    return res.render('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const stripe = require("stripe")(


    "sk_test_51LxXaMA3Pa2TDpvcMaIJUyNvZS8QdggqA6iKSQDsed8BlMa2n5b9CYzAE0IlpcjXuyvqZw4GmCMcRst8rl37Zix800sfzniONs"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken,
    description: "Test charge"
  }, function(err, charge){
    if (err){
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    const order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      req.flash('success', 'Successfully bought product!');
    req.session.cart = null;
    res.redirect('/');
    })
  });
})

module.exports = router;

