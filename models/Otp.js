const _= require('lodash');
const { connectToCluster } = require('./db_config');
const uri = "mongodb+srv://bidbazarAdmin:3PcTg6kw6Ppmxm1L@bidbazarserver.zyh3oev.mongodb.net/?retryWrites=true&w=majority";

const moment=require('moment')


class Otp {
    constructor(Otp = {}) {
        this.email = Otp.email;
        this.otp_code = Otp.otp_code;
        this.expired_at = Otp.expired_at;
    }
    async save() {
        let client;
        client = await connectToCluster(uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('otp');
        collection.insertOne(this, (err, result) => {
            if (result) {
                console.log('OTP saved successfully');
            }
            else {
                console.log('OTP Not saved successfully');
            }
        })
    }
    async verify(otp) {
        let client;
        client = await connectToCluster(uri)
        const db = await client.db('bidbazar');
        const collection = db.collection('otp');
        const response= await collection.find({otp_code:parseInt(otp[0])},{}).toArray();
        var time = moment().local();
        var sec = moment.duration(time, 'seconds').asSeconds()
        if(!_.isEmpty(response))
        {
        if (response[0].expired_at>= sec) {
                console.log("in if condition")
               await collection.deleteOne({otp_code:parseInt(otp[0])}).then(result => {
                    console.log("in delete function")
                  return {message:"OTP is Verified",code:1};
                })
            }
        else{
                console.log("expired")
                return {message:"your otp is expired",code:2}
            }
        }
        else
        {
            return {message:"your otp is invalid",code:1}
        }
    }
}

module.exports = Otp;