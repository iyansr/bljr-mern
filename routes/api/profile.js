const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};
  Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar'])
    .then(profile => {
      errors.noprofile = 'No profile for this user';
      if (!profile) {
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));

});

// @route   GET api/profile/all
// @desc    Get all profiles
// access   Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if(!profiles){
        errors.noprofiles = 'No Profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// access   Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({handle: req.params.handle})
  .populate('user', ['name', 'avatar'])
  .then(profile =>{
    if(!profile){
      errors.noprofile = 'No Profile for this user';
      res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by User ID
// access   Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
  .populate('user', ['name', 'avatar'])
  .then(profile =>{
    if(!profile){
      errors.noprofile = 'No Profile for this user';
      res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err));
});


// @route   POST api/profile
// @desc    Create or Edit user profile
// access   Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateProfileInput(req.body);

  //Check validation
  if (!isValid) {
    //Return any errors w/ 400 status
    return res.status(400).json(errors);
  }

  //Get fields
  const profilefields = {};
  profilefields.user = req.user.id;
  if (req.body.handle) profilefields.handle = req.body.handle;
  if (req.body.company) profilefields.country = req.body.company;
  if (req.body.website) profilefields.website = req.body.website;
  if (req.body.location) profilefields.location = req.body.location;
  if (req.body.status) profilefields.status = req.body.status;
  if (req.body.bio) profilefields.bio = req.body.bio;
  if (req.body.githubusername) profilefields.githubusername = req.body.githubusername;

  //Skills into aray
  if (typeof req.body.skills !== 'undefined') {
    profilefields.skills = req.body.skills.split(',');
  }
  //Social
  profilefields.social = {};
  if (req.body.youtbe) profilefields.social.youtbe = req.body.youtbe;
  if (req.body.instagram) profilefields.social.instagram = req.body.instagram;
  if (req.body.facebook) profilefields.social.facebook = req.body.facebook;
  if (req.body.twitter) profilefields.social.twitter = req.body.twitter;
  if (req.body.linkedin) profilefields.social.linkedin = req.body.linkedin;
  if (req.body.steam) profilefields.social.steam = req.body.steam;

  Profile.findOne({
    user: req.user.id
  }).then(profile => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate({
        user: req.user.id
      }, {
        $set: profilefields
      }, {
        new: true
      }).then(profile => res.json(profile));
    } else {
      // Create

      // Check if handle exists
      Profile.findOne({
        handle: profilefields.handle
      }).then(profile => {
        if (profile) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        }

        // Save Profile
        new Profile(profilefields).save().then(profile => res.json(profile));
      });
    }
  });

});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// access   Private
router.post('/experience', passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const{errors, isValid} = validateExperienceInput(req.body);

    //check validation
    if(!isValid){
      return res.status(404).json(errors);
    }

    Profile.findOne({user: req.user.id}).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //add exp to array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    })
  });

  // @route   POST api/profile/education
// @desc    Add education to profile
// access   Private
router.post('/education', passport.authenticate('jwt', {session: false}),
(req, res) => {
  const {errors, isValid} = validateEducationInput(req.body);

  //check validation
  if(!isValid){
    return res.status(404).json(errors);
  }

  Profile.findOne({user: req.user.id}).then(profile => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldOfStudy: req.body.fieldOfStudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    profile.education.unshift(newEdu);

    profile.save().then(profile => res.json(profile));

  });
});

// @route   DELTE api/profile/experience/:exp_id
// @desc    Delete experience for profile
// access   Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}),
  (req, res) => {

    Profile.findOne({user: req.user.id})
    .then(profile => {
      //get remove index
      const rmIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

      // splice out of array
      profile.experience.splice(rmIndex, 1);

      //save
      profile.save().then(profile => res.json(profile));

    })
    .catch(err => res.status(404).json(err));

  });

// @route   DELTE api/profile/experience/:edu_id
// @desc    Delete education for profile
// access   Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}),
(req, res) => {

  Profile.findOne({user: req.user.id})
  .then(profile => {

    //get remove index
    const rmIndex = profile.education
    .map(item => item.id)
    .indexOf(req.params.edu_id);

    // splice out of array
    profile.education.splice(rmIndex, 1);

    //save
    profile.save().then(profile => res.json(profile));

  })
  .catch(err => res.status(404).json(err));

});

// @route   DELTE api/profile/experience/:edu_id
// @desc    Delete education for profile
// access   Private
router.delete('/', passport.authenticate('jwt', {session: false}),
(req, res) => {

    Profile.findOneAndRemove({user: req.user.id})
      .then(() => {
        User.findOneAndRemove({_id: req.user.id})
        .then(() => res.json({success: true}))
      })

});

module.exports = router;