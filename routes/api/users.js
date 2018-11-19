const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//Load User model
const User = require('../../models/User');

// @route   GET api/uers/test
// @desc    Users Post Route
// access   Public
router.get('/test', (req, res) => {
    res.json({
        msg: "Users Work"
    });
});

// @route   GET api/uers/register
// @desc    Register User
// access   Public

router.post('/register',(req, res) =>{
    User.findOne({email: req.body.email}) //Find user yang sudah ada
        .then(user => {
            if(user){ //Jika user sudah ada
                return res.status(400).json({email: 'Email already exist'});
            }else{
                                //Url Email
                const avatar = gravatar.url(req.body.email, {
                    s: 200, //size
                    r: 'PG', //rating
                    d: 'mm' //default
                })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                /**
                 * Encrypt Password
                 * 1. gen salt (jumlah karakter, callback)
                 */
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                    })
                })
            }
        })
});

// @route   GET api/uers/login
// @desc    Login User / Returning JWT Token
// access   Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //FInd User By Email
    User.findOne({email})
        .then(user => {
            //Check For User
            if(!user){
                return res.status(404).json({email: 'User not found'});
            }

            //Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                if(isMatch){
                    //User Matched
                    
                    //Create JWT payload
                    const payload = {id: user.id, name: user.name, avatar: user.avatar};

                    //SIgn Token
                    jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, 
                        (err, token) =>{
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                    });
                }else{
                    return res.status(400).json({password: 'Password Incorrect'});
                }
            })
        });
});


module.exports = router;    