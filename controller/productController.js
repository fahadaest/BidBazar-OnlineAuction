const bcrypt = require("bcryptjs");
const _ = require('lodash');
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const axios = require('axios');
const fs = require('fs');

exports.postProduct = async function (req, res, next) {
  try {
    let images = [];
    if (!_.isEmpty(req.body)) {
      const Uploadedimages = req.files
      Uploadedimages.forEach((image, i) => {
        images[i] = `/uploads/${image.filename}`;
      })
      const inputs = await preparePramas(req.body, images)
      console.log("----------- Prepared Inputs ----------------", inputs);
      const prod = new Product(inputs);
      await prod.save().then(async product => {
        if (product) {
          const products = await prod.loadProducts().then((prod) => {
            return prod
          })
          res.render('product', {
            logged_in: req.session.logged_in,
            products: products,
            alert: true,
            type: 'alert-success text-center',
            message: 'Product listed Sucessfully'
          })
        }
      });
    }
  }
  catch (err) {
    console.log(err);
  }

}
const preparePramas = async (product, images) => {

  const inputs = {};
  inputs.title = product.title;
  inputs.description = product.description;
  inputs.category = product.category;
  inputs.bid_price = product.bid_price;
  inputs.current_bid = 0;
  inputs.image = images;
  inputs.status = 'U';
  inputs.store_id = product.store_id;
  inputs.start_time = product.start_time;
  inputs.end_time = product.end_time;
  return inputs;
}

exports.getProducts = async (req, res) => {
  const prod = new Product();
  await prod.loadAllProducts().then(product => {
    console.log(product);
    res.render('product', { logged_in: req.session.logged_in, products: product, alert: false })
  });
}
exports.getListedProducts = async (req, res) => {
  const id = req.params.id;
  const prod = new Product();
  await prod.loadProducts(id).then(product => {
    console.log(product);
    res.render('listed-Product', {
      path: '/api/',
      logged_in: req.session.logged_in,
      products: product,
      alert: false
    })
  });
}

exports.deleteProducts = async (req, res) => {
  const id = req.params.id;
  const user_id = req.session.user_id
  const prod = new Product();
  await prod.deleteProdcut(id).then(product => {
    res.redirect(`/api/listed-Product/${user_id}`,{alert:false})
  });
}

exports.getProductsbyCategory = async (req, res) => {
  console.log(req)
  const category = req.body.category;
  console.log(category);
  const prod = new Product();
  await prod.getProductsByCategory(category).then(product => {
    console.log(product);
    res.render('product', { logged_in: req.session.logged_in, products: product, alert: false })
  })
}
exports.getbyCategory = async (req, res) => {
  const category = req.params.category;
  console.log(category);
  const prod = new Product();
  await prod.getProductsByCategory(category).then(product => {
    console.log(product);
    res.render('product', {
      path: "/api/product",
      logged_in: req.session.logged_in,
      products: product, 
      alert: false
    })
  })
}
exports.getProductDetail = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const prod = new Product();
  const bid = new Bid();
  bidData = await bid.loadBid(id).then(bid => { return bid })
  await prod.getById(id).then(product => {
    console.log(product, bid);
    res.render('item-detail', { logged_in: req.session.logged_in, product: product, bids: bidData,alert:false })
  })
}

exports.bidNow = async (req, res) => {
  console.log(req.session);
  const inputs = req.body;
  inputs['user'] = req.session.user_id;
  inputs['username'] = req.session.username;
  const prod = new Product();
  const id = inputs['id'];
  await prod.updateBidPrice(inputs).then(product => {
    console.log(id);
    res.redirect(`/api/getProductDetail/${id}`)
  })
}
exports.getCreateProduct = (req, res) => {
  res.render('createProduct', { logged_in: req.session.logged_in, store_id: req.params.id ,alert:false})
}
exports.updatebid = async (req, res) => {
  const id = req.params.id
  const bid = new Bid();
  const data = await bid.updateDescription(id).then(() => { })

}
