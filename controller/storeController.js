const Store=require('../models/Store')
const Product=require('../models/Product')
const mongodb = require('mongodb');

const _ = require('lodash');

exports.createStore=async (req,res)=>{
    const inputs=req.body;
    const image=req.file.filename;
    inputs.image=`/uploads/${image}`;
    const input=preparePramas(inputs,req.session.user_id);
    const store=new Store(input);
    await store.save().then(store=>{
        res.render('index',{logged_in:req.session.logged_in, alert: true,
          type: 'alert-success text-center',
          message: 'Store Created Successful'})
    })
}

const preparePramas =(store,id) => {
    const inputs = {};
    inputs.fullname = store.fullname;
    inputs.name = store.name;
    inputs.image = store.image;
    inputs.store_description=store.description
    inputs.user_id=id;
    return inputs;
  }
exports.loadStores=async (req,res)=>{
    const store = new Store();
    await store.loadStores().then(store => {
      res.render('storeList',{logged_in:req.session.logged_in,store:store,alert:false})
    });
}

exports.getStore=async(req,res)=>{
    const id=req.session.user_id
    const store = new Store();
    const product=new Product();
    await store.getUserStore(id).then(async store => {
      if(!_.isEmpty(store))
      {
        const Obj_id=new mongodb.ObjectId(store[0]._id)
        const id=Obj_id.toString()
        const data=await product.getByStoreId(id).then(prod=>{
          return prod;
        })
        console.log(data);
        res.render('store',{logged_in:req.session.logged_in,store:store[0],products:data})
      }
      else{
        res.redirect('/api/createStore',{alert:false})
      }
    });
}

exports.getStoreById=async(req,res)=>{
    const id=req.params.id
    const store = new Store();
    const product=new Product();
    await store.getStore(id).then(async store => {
        await product.getByStoreId(id).then(prod=>{
          res.render('store',{logged_in:req.session.logged_in,store:store[0],products:prod,alert:false})
        });
      });
}