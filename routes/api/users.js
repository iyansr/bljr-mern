const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load Input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


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
router.post('/register', (req, res) => {
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(404).json(errors);
  }

  User.findOne({
      email: req.body.email
    }) //Find user yang sudah ada
    .then(user => {
      if (user) { //Jika user sudah ada
        errors.email = 'Email alreadyexist'
        return res.status(400).json(errors);
      } else {
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
            if (err) throw err;
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
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(404).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //FInd User By Email
  User.findOne({
      email
    })
    .then(user => {
      //Check For User
      if (!user) {
        errors.email = 'User email not found';
        return res.status(404).json(errors);
      }

      //Check Password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            //User Matched

            //Create JWT payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };

            //SIgn Token
            jwt.sign(payload, keys.secretOrKey, {
                expiresIn: 3600 * 2
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
          } else {
            errors.password = 'Password Incorrect';
            return res.status(400).json(errors);
          }
        })
    });
});

// @route   GET api/uers/current
// @desc    Return current user
// access   Private
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  });
});


module.exports = router;