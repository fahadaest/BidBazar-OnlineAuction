const bcrypt = require("bcryptjs");
const _ = require('lodash');
const { connectToCluster, getDB } = require('../models/db_config');
const jwt = require('jsonwebtoken');
//const { general_Config } = require('../config/config');
//const secret_key = "uhufwjn4t2jbh"
const uri = "mongodb+srv://bidbazarAdmin:3PcTg6kw6Ppmxm1L@bidbazarserver.zyh3oev.mongodb.net/?retryWrites=true&w=majority";

exports.getSigninPage = (req, res) => {
    res.render('signin',{alert:false});
}
exports.postSignin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    client = await connectToCluster();
    db = client.db('bidbazar');
    const collection = db.collection('users');
    console.log(collection);
    collection.findOne({ email })
        .then(users => {
            console.log("In the function", users)
            if (!users) {
                res.redirect('/api/signin',{alert:false})
            }
            return users;
        })
        .then(async user => {
            console.log(user);
            console.log(user.password, password);
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                req.session.logged_in = true;
                req.session.username = user.username;
                req.session.user_id = user._id;
                return req.session.save((err) => {
                    res.render('index', {
                        logged_in: req.session.logged_in,
                        alert: true,
                        type: 'alert-success text-center',
                        message: 'Signed in Successful'
                    })
                });
            }
        })
}
