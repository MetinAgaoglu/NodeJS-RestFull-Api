const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Director = require('../models/Director');

/* GET home page. */
router.post('/', function(req, res, next) {
    const director = new Director(req.body);
    const promise = director.save();

    promise.then((data)=>{
        res.json({status:true,data:data});
    }).catch((err)=>{
        res.json({status:false,err:err});
    });
});

router.get('/',(req,res)=>{

    const promise = Director.aggregate([
        {
            $lookup: {
                from: 'moviews',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind:{
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group:{
                _id:{
                    _id:'$_id',
                    name:'$name',
                    surname:'$surname',
                    bio:'$bio'
                },
                movies:{
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies: '$movies'
            }
        }
    ]);

    promise.then((data)=> {
        res.json(data);
    });
});

router.get('/:director_id',(req,res)=>{

    const promise = Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.director_id)
            }
        },
        {
            $lookup: {
                from: 'moviews',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind:{
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group:{
                _id:{
                    _id:'$_id',
                    name:'$name',
                    surname:'$surname',
                    bio:'$bio'
                },
                movies:{
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies: '$movies'
            }
        }
    ]);

    promise.then((data)=> {
        res.json(data);
    });
});

router.put('/:director_id',(req,res,next)=>{
    const promise = Director.findByIdAndUpdate(req.params.director_id,req.body,{new:true});

    promise.then((director)=>{
        if(!director)
            next({ is_exists:1 , message:'The Director Not Found' });

        res.json({ status:true,data:director });
    }).catch((err)=>{
        res.json(err);
    });
});

router.delete('/:director_id',(req,res,next)=>{
    const promise = Director.findByIdAndRemove(req.params.director_id);

    promise.then((director)=>{
        if(!director)
            next({ is_exists:1 , message:'The Director Not Found' });

        res.json({ status:true });
    }).catch((err)=>{
        res.json(err);
    });
});

module.exports = router;
