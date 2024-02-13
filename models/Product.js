const { result } = require('lodash');
const { connectToCluster } = require('./db_config');
const Bid=require('./Bid')
const mongodb = require('mongodb');
const { response } = require('express');
const uri = "mongodb+srv://bidbazarAdmin:3PcTg6kw6Ppmxm1L@bidbazarserver.zyh3oev.mongodb.net/?retryWrites=true&w=majority";

class Product {
    constructor(product = {}) {
        this.title = product.title;
        this.description=product.description;
        this.category=product.category;
        this.bid_price = product.bid_price;
        this.current_bid=product.current_bid;
        this.image=product.image;
        this.store_id=product.store_id;
        this.status=product.status;
        this.start_time=product.start_time;
        this.end_time=product.end_time;
    }
    async save() {
        let client,products;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('products');
        await collection.insertOne(this);
        return true;
    }
    async loadAllProducts()
    {
        let client,products;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('products')
        products =await collection.find().toArray();;
        console.log("here in the model",products)
        return products;
    }
    async loadProducts(id)
    {
        let client,products;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('products')
        products =await collection.find({store_id:id}).toArray();
        console.log("here in the model",products)
        return products;
    }
    async deleteProdcut(id)
    {
        let client,response;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('products')
        response=await collection.findOneAndDelete({_id:new mongodb.ObjectId(id)})
        return response;
    }
    async getProductsByCategory(cate)
    {
        let client,product;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('products')
        product = await collection.find({category:cate}).toArray();
        return product;
    }
    async getById(id)
    {
        let client,product;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('products')
        product = await collection.find({_id:new mongodb.ObjectId(id)}).toArray();
        return product;
    }
    async updateBidPrice(inputs)
    {
        let client,product;        
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('products')
        const bid=new Bid(inputs);
        await bid.save().then();
        await collection.findOneAndUpdate({_id:new mongodb.ObjectId(inputs['id'])},{$set:{current_bid:inputs['newbid_price']}})
        product = await collection.find({_id:new mongodb.ObjectId(inputs['id'])}).toArray();
        return product;
    }
    async getByStoreId(id)
    {
        let client,product;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('products')
        product = await collection.find({store_id:id}).toArray();
        return product;
    }
    async getAll()
    {
        let client,product;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('products')
        product = await collection.find({ status: { $ne: 'S'}}).toArray();
        return product;   
    }
    async updateStatus(ids)
    {
        let client;
        client= await connectToCluster (uri)
        const filter = { _id: { $in: ids.map(id =>new mongodb.ObjectId(id))} };
        const update = { $set: { status: 'S' } };
        const db = await client.db('bidbazar');
        const collection =db.collection('products');
        const result = await collection.updateMany(filter, update);
        console.log("here in the product model",result)
        return result;
    }
}

module.exports = Product;