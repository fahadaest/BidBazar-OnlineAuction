const User=require('../models/User')


exports.getUserbyid=async(req,res)=>{
    const id=req.session.user_id
    console.log(id)
    const user=new User();
    await user.getUser(id).then(user=>{
        console.log(user)
      res.render('userProfile',{logged_in:req.session.logged_in,user:user[0],alert:false})
    })
}
exports.updateProfile=async(req,res)=>{
    const id=req.session.user_id
    const inputs=preparePramas(req.body);
    console.log(inputs)
    const user=new User();
    await user.updateProfile(id,inputs).then(user=>{
        console.log(user)
      res.redirect('/api/userProfile',{alert:false})
    })
  }
  function preparePramas(params){
  const inputs = {};
  inputs.username = params.username;
  inputs.email = params.email;
  inputs.cnic=params.cnic;
  inputs.image=params.image;
  inputs.address=params.address;
  inputs.city=params.city;
  inputs.region=params.region
  inputs.phone=params.phone;
  return inputs;
}