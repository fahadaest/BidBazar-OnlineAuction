const cron = require('node-cron');
const moment = require('moment');
const Product= require('./models/Product');
const Bid= require('./models/Bid');
const _ = require('lodash');

const updateStatus = async () => {
try{
    let ids=[];
    const product=new Product();
    const bid=new Bid();
    const products =await product.getAll().then(prod=>{
        return prod;
    });
    products.forEach((prod,key)=>{
        const endTime = moment(prod.end_time);
        const currentTime = moment();
        if (endTime.isBefore(currentTime)){
            ids[key]=prod._id;
        }
    });
    console.log(ids)
    if(!_.isEmpty(ids))
    {
        console.log(ids)
        let max=[];
        ids.forEach(async(id,key)=>
        {
            console.log(id)
        const biddata=await bid.loadBid(id).then(bid=>{return bid});
        console.log(biddata)
        });
        process.exit(1);
    const data=await product.updateStatus(ids).then(async prod=>{
        const data=await bid.updateDescription(ids)
        return prod;
    });
    if(data.acknowledged)
    {
        console.log('Product Status Update Successfully');
    }
    else
    {
    console.log('Something went Wrong');
    }
    }
    else
    {
        console.log("No Product Remaining to Update the Status")
    }

  } catch (error) {
    console.error('Error updating status:', error.message);
  }
};

// Schedule the cron job to run every 3 hours
// cron.schedule('* * * * *', () => {
  updateStatus();
// });
