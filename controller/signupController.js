const bcrypt = require("bcryptjs");
const _ = require('lodash');
const User = require('../models/User');
const Otp= require('../models/Otp')
const {sendEmail}=require('../sendmail/sendEmail');
const transporter=require('../sendmail/transporter')
const moment=require('moment');
const flash = require("express-flash");

exports.postSignUp = async function (req, res, next) {
  try {
    console.log("----------- Sign Up Request Params ----------------", req.body);
    if (!_.isEmpty(req.body)) {
      inputs = await preparePramas(req.body)
      console.log("----------- Sign Up Prepared Inputs ----------------", inputs);
      const user = new User(inputs);
      await user.save().then(user => {
        console.log(user)
        if (user.code == 2) {
          
        }
        const otp = getOTP();
        const params = prepareOtpparams(inputs.email, otp);
        console.log(params);
        var expiretime = new Date(params.expired_at).toLocaleString();
        sendEmail(inputs.email, otp,expiretime).then(mailOptions => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    const otp = new Otp(params);
                    otp.save();
                    res.render('verifyOtp',{alert:false});
                }
            })
        })

      });

    }
  }
  catch (err) {
    console.log(err);
  }

}

const preparePramas = async (params) => {
  const inputs = {};
  inputs.username = params.name;
  inputs.email = params.email;
  inputs.password = await passwordHash(params.pass);
  inputs.cnic = params.cnic;
  inputs.image = "/images/default.png";
  inputs.phone = params.phone;
  return inputs;
}

const passwordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);
  return hashpassword;
}
exports.sendOtp=async (req,res)=>{
  res.render('verifyOtp',{alert:false})
}
exports.postVerifyOtp = async (req, res) => {
    inputs = req.body;
    console.log(inputs);
    const otp=new Otp();
    await otp.verify(inputs.otp).then((result)=>{
      console.log(result)
      if(result.code==1)
      {
        res.render('signin',{alert:true,message:"Registration Successful, please login to start bidding",type:'alert-success text-center'})
      }
      else if(result.code==2)
      {
        res.render('verifyOtp',{alert:true,message:"Your Otp is Invalid",type:'alert-danger text-center'});
      }
    })
}

function getOTP() {
    const num = Math.floor(Math.random() * 9000 + 1000);
    return num
}

function prepareOtpparams(email, otp_code) {
    var time = moment().add(5, 'm').local();
    var sec=moment.duration(time,'seconds').asSeconds()
    const inputs = {};
    inputs.email = email;
    inputs.otp_code = otp_code;
    inputs.expired_at =sec
    return inputs;
}