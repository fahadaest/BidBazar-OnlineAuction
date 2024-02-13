const { result } = require('lodash');
const { connectToCluster } = require('./db_config')
const mongodb = require('mongodb');

const uri = "mongodb+srv://bidbazarAdmin:3PcTg6kw6Ppmxm1L@bidbazarserver.zyh3oev.mongodb.net/?retryWrites=true&w=majority";

class User {
    constructor(user = {}) {
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.phone=user.phone;
        this.cnic=user.cnic;
        this.image=user.image;
        this.is_verfied = false;
    }
    async save() {
        let client;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('users');
        const user = await collection.findOne({ email: this.email });
        if (user) {
            return { message: "User is already registered", code: 2 }
        }
        else {
            let result={};
            return await collection.insertOne(this);
    }
    }
    async login(params) {
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('users');
        const user = await collection.findOne({ email: this.email });
        if (user) {
            return { message: "User is already registered", code: 2 }
        }
    }
    async getUser(id)
    {
        let client,user;
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('users');
        user = await collection.find({_id:new mongodb.ObjectId(id)}).toArray();
        return user;
    }
    async updateProfile(id,inputs)
    {
        client= await connectToCluster (uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('users');
        return await collection.findOneAndUpdate({_id:new mongodb.ObjectId(id)},{$set:inputs})
    }
}

module.exports = User;