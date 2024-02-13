const _= require('lodash');
const { connectToCluster } = require('./db_config');
const mongodb = require('mongodb');
const { response } = require('express');
const uri = "mongodb+srv://bidbazarAdmin:3PcTg6kw6Ppmxm1L@bidbazarserver.zyh3oev.mongodb.net/?retryWrites=true&w=majority";

class Bid {
    constructor(bid = {}) {
        this.product_id = bid.id;
        this.bid_by=bid.user;
        this.bid_by_name=bid.username
        this.bid_price=parseInt(bid.newbid_price);
        this.description="Bid by";
        this.bid_time=Date.now();
    }
    async save() {
        let client; 
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('bid');
        await collection.insertOne(this);
        return true;
    }
    async loadBid(id)
    {
        let client,bid;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('bid');
        bid = await collection.find({product_id:id}).toArray();
        return bid;
    }
    async loadBids(ids)
    {
        let client,bid;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('bid');
        bid = await collection.find({product_id:{$in: ids.map(id =>new mongodb.ObjectId(id))}}).toArray();
        return bid;
    }
    async updateDescription(id)
    {
        console.log(id)
        let client,bid;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('bid'); 
        const result =await collection.aggregate([
            {
              $match: { product_id:id }
            },
            {
                $group: {
                    _id: "$product_id",
                    maxBid: { $max: "$bid_price" },
                    documentIds: { $push: "$_id" }
                  }
            },
            {
              $project: {
                _id: { $arrayElemAt: ['$documentIds', 0] },
                bid: '$maxPrice'
              }
            }
          ]); 
          console.log(result)
        //   return result;
    }
   
}

module.exports = Bid;