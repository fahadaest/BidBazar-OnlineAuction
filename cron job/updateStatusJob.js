const cron = require('node-cron');
const moment = require('moment'); // Install moment if not already installed
const axios = require('axios'); // Install axios if not already installed
const Product= require('../models/Product');
// Function to update the status
const updateStatus = async () => {
try{
    const data=[];
    const product=new Product();
    const products =await product.getAll().then(prod=>{
        return prod;
    });
    products.forEach((prod,key,data)=>{
        const endTime = moment(prod.end_time);
        const currentTime = moment();
        if (endTime.isBefore(currentTime)){
            data[key]=
            {
                id:prod_id,
                status:"S"}
        }
    });
    console.log(data)
    // const endTime = moment(product.end_time);
    // const currentTime = moment();
    // if (endTime.isBefore(currentTime)) {
    //   // Update the status to "S" or perform any other necessary task
    //   product.status = "S";

    //   // Dispatch the job or perform any other necessary action
    //   console.log('Dispatching job for product:', product);

    //   // Make an HTTP request to update the product status or perform any other necessary action
    //   const response = await axios.patch('http://your-api-url.com/update-product', product);

    //   console.log('Status updated:', response.data);
    // }
  } catch (error) {
    console.error('Error updating status:', error.message);
  }
};

// Schedule the cron job to run every 3 hours
cron.schedule('0 */3 * * *', () => {
  updateStatus();
});
