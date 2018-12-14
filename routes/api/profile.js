const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load validation
const validateProfileInput = require('../../validation/profile');

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


// @route   POST api/profile
// @desc    Create or Edit user profile
// access   Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    //Check validation
    if(!isValid){
        //Return any errors w/ 400 status
        return res.status(400).json(errors);
    }

    //Get fields
    const profilefields = {};
    profilefields.user = req.user.id;
    if(req.body.handle) profilefields.handle = req.body.handle;
    if(req.body.company) profilefields.country = req.body.company;
    if(req.body.website) profilefields.website = req.body.website;
    if(req.body.location) profilefields.location = req.body.location;
    if(req.body.status) profilefields.status = req.body.status;
    if(req.body.bio) profilefields.bio = req.body.bio;
    if(req.body.githubusername) profilefields.githubusername = req.body.githubusername;

    //Skills into aray
    if(typeof req.body.skills !== 'undefined'){
        profilefields.skills = req.body.skills.split(',');
    }
    //Social
    profilefields.social = {};
    if(req.body.youtbe) profilefields.social.youtbe = req.body.youtbe;
    if(req.body.instagram) profilefields.social.instagram = req.body.instagram;
    if(req.body.facebook) profilefields.social.facebook = req.body.facebook;
    if(req.body.twitter) profilefields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profilefields.social.linkedin = req.body.linkedin;
    if(req.body.steam) profilefields.social.steam = req.body.steam;

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(profile){
                //Update
                Profile.findByIdAndUpdate(
                    {user: req.user.id}, 
                    {$set: profilefields}, 
                    {new: true}
                ).then(profile => res.json(profile));
            }else{
                //Create

                //Check if handle exist
                Profile.findOne({handle: profilefields.handle}).then(profile => {
                    if(profile){
                        errors.handle = 'Handle is exsist';
                        res.status(400).json(errors);
                    }
                    //Save profile
                    new Profile(profilefields).save().then(profile => res.json(profile));
                });
            }
        })


});


module.exports = router;