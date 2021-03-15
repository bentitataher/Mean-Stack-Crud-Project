const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Get All / passport.authenticate('bearer', { session: false }) ,  
router.get('/', function(req, res){
    User.find({})
        .then(function(users){
            res.send(users)
        });
});

// Get by one /
router.get('/:id',function(req, res){
    User.findOne({_id: req.params.id})
        .then(function(user){
            res.send(user);
        });
});

// Post / registration
router.post('/signup', function(req,res,next){

    User.findOne({email: req.body.email}).then(user=>{
        if(user){
            return res.status(409).json({message : 'Mail exist'});
        }
    
        else{

            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                        
                if(err){
                    return res.status(500).json({
                        error : err
                    });
                } 

                else{
                    req.body.password = hash;
                    User.create(req.body)
                        .then(function(user){
                        res.send(user)
                    })
                        .catch(next)
                    
                }
                
            }); 

        }
    
    });

                 
    
});

// Post / login
router.post('/login',(req,res)=>{
    User.find({email: req.body.email})
        .then(user => {
            if (user.length<1){
                return res.status(401).json({
                    message : 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
                if (err) {
                    return res.status(401).json({
                        message : 'error 1'
                    });
                }
                if(result){

                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    'secret',
                    {
                        expiresIn: "1d"
                    },

                    );

                    return res.status(200).json({
                        message : 'Auth seccussful',
                        checkResult : result,
                        token : token
                    });
                }
                res.status(401).json({
                    message : 'Auth failed',
                    checkResult : result,
                });
            })
        })
});

// Put / 
router.put('/:id', function(req,res){
  User.findByIdAndUpdate({_id: req.params.id}, req.body)
      .then(function(){
          User.findOne({_id: req.params.id})
              .then(function(user){
                  res.status(299).send(user)
              });
      });  
});

// Delete /
router.delete('/:id', function(req, res){
  User.findByIdAndDelete({_id: req.params.id})
      .then(function(user){
          res.status(201).send(user);
      });  
});





module.exports = router;