const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://bidbazarAdmin:3PcTg6kw6Ppmxm1L@bidbazarserver.zyh3oev.mongodb.net/?retryWrites=true&w=majority";
const connectToCluster=async(callback)=>{
    let mongoClient;
    try {
        
        console.log('Connecting to MongoDB Atlas cluster...');
        mongoClient =await new MongoClient(uri);
        console.log('Successfully connected to MongoDB Atlas!');
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }
 exports.connectToCluster=connectToCluster;

