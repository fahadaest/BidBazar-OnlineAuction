const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bidbazarmanagement@gmail.com',
      pass: 'itansfgktmpicpyk'
    }
  });

module.exports=transporter;