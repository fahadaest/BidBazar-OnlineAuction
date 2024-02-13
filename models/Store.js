const { result } = require('lodash');
const { connectToCluster } = require('./db_config')
const mongodb = require('mongodb');
const uri = "mongodb+srv://bidbazarAdmin:3PcTg6kw6Ppmxm1L@bidbazarserver.zyh3oev.mongodb.net/?retryWrites=true&w=majority";

class Store {
    constructor(store = {}) {
        this.store_fullname = store.fullname;
        this.store_name = store.name;
        this.store_image = store.image;
        this.store_description =store.store_description;
        this.user_id=store.user_id;
    }
    async save() {
        let client;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('store');
        return await collection.insertOne(this);
    }
    async loadStores()
    {
        let client,stores;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('store')
        stores =await collection.find().toArray();
        console.log("here in the model",stores)
        return stores;
    }
    async getUserStore(id)
    {
        let client,stores;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('store')
        stores =await collection.find({user_id:id}).toArray();
        console.log("here in the user store model",stores)
        return stores;
    }
    async getStore(id)
    {
        let client,stores;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection =db.collection('store')
        stores =await collection.find({_id:new mongodb.ObjectId(id)}).toArray();
        console.log("here in the store model",stores)
        return stores;
    }

}

module.exports = Store;