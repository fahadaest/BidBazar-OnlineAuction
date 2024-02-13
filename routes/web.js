const express = require('express');
const router=express.Router();
const {connectToCluster}=require('../models/db_config')
const signupController=require('../controller/signupController')
const signinController=require('../controller/signinController')
const productController=require('../controller/productController')
const storeController=require('../controller/storeController');
const userController=require('../controller/userController')
const upload = require('../middleware/imageUpload'); 
const authMiddleware = require('../middleware/auth');

const uri = "mongodb+srv://bidbazarAdmin:3PcTg6kw6Ppmxm1L@bidbazarserver.zyh3oev.mongodb.net/?retryWrites=true&w=majority";

router.get('/',function(req, res){
        res.render('index',{logged_in: req.session.logged_in, alert:false })});
router.get('/signup',function (req,res)
{
res.render('signup',{alert:false})
});
router.post('/signup',signupController.postSignUp);
router.get('/signin',signinController.getSigninPage);
router.post('/signuser',signinController.postSignin);
router.get('/products',productController.getProducts)
router.get('/storeList',storeController.loadStores)
router.get('/aboutus',(req,res)=>{
        res.render('aboutUs',{logged_in:req.session.logged_in,alert:false})
})
router.get('/contactus',(req,res)=>{
        res.render('contactUs',{logged_in:req.session.logged_in,alert:false})
})
router.get('/add-product/:id',productController.getCreateProduct)
// router.get('/forgetPassword',loginController.getforgetPassword);
router.post('/createProduct',upload.array('image',5),productController.postProduct);
router.get('/listed-Product/:id',authMiddleware,productController.getListedProducts)
router.get('/delete-product/:id',authMiddleware,productController.deleteProducts)
router.post('/getCategory',productController.getProductsbyCategory)
router.get('/getProductDetail/:id',productController.getProductDetail)
router.get('/getByCategory/:category',productController.getbyCategory)

router.post('/bid',authMiddleware,productController.bidNow)
router.get('/store',authMiddleware,storeController.getStore);
router.get('/store/:id',storeController.getStoreById)
router.get('/createStore',authMiddleware,(req,res)=>{
        res.render('createStore',{logged_in:req.session.logged_in, alert:false})
})
router.post('/createStore',authMiddleware,upload.single('image'),storeController.createStore)
router.get('/signout',(req,res)=>{
        req.session.destroy();
        res.redirect('/api/',{alert:false});
})
router.get('/userProfile',authMiddleware,userController.getUserbyid)
router.post('/updateProfile',authMiddleware,userController.updateProfile)
router.get('/updateStatus/:id',productController.updatebid)
router.get('sendOtp',signupController.sendOtp)
router.post('/verifyOtp',signupController.postVerifyOtp);
module.exports=router;