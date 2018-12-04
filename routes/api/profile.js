const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile Model
const Profile = require('../../models/Profile');
// //Load User Model
const User = require('../../models/User');


// @route GET api/profile/test
// @desc    Profile Post Route
// access   Public
router.get('/test', (req, res) => {
    res.json({
        msg: "Profile Work"
    });
});

// @route   GET api/profile
// @desc    GET Current User Profile
// access   Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};
    Profile.findOne({user: req.user.id })
        .then(profile => {
            errors.noprofile = 'No profile for this user';
            if(!profile){
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));

});


module.exports = router;