const express = require('express');
const router = express.Router();

const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next) => {
    const { name,password } = req.body;
    
    brcypt.hash(password,10).then((hash)=>{
        const user = new User({
            name,password:hash
        });
        console.log(user);
        const promise = user.save();
    
        promise.then((data)=>{
            res.json({status:true,data:data});
        }).catch((err)=>{
            res.json({status:false,erro:err});
        });
    });
});

router.post('/authenticate',(req,res)=>{
    const {name,password} = req.body;

    User.findOne({
        name
    },(err,user) => {
        
        if(!user) {
            res.json({
                status:false,
                message: 'Authentication failed, user not found.'
            })
        } else {
            brcypt.compare(password,user.password).then((result) => {
                if(!result){
                    res.json({
                        status:false,
                        message:'Authentication failed, wrong password.'
                    })
                } else {
                    const payload = {
                        name
                    };
                    const token = jwt.sign(payload,req.app.get('api_secret_key'),{
                        expiresIn: 720 // 12 Saat
                    });

                    res.json({
                        status:true,
                        token
                    });
                }
            });
        }
    });

});

module.exports = router;
