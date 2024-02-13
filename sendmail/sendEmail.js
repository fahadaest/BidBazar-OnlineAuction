const ejs = require("ejs");

exports.sendEmail=async(email,otp,time)=>{
    const data= await ejs.renderFile('views/sendMail.ejs',{otp:otp,expire:time});
       const mailOptions = {
      from: 'bidbazarmanagement@gmail.com',
      to:  `${email}`,
      subject: 'Verify OTP Email',
      html: data,
    };
    return mailOptions;
}