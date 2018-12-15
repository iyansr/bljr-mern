const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if (!Validator.isLength(data.handle, {
      min: 2,
      max: 40
    })) {
    errors.handle = 'Handle needs to be between 2 and 40 chars';
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status is required';
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills is required';
  }


  //Website validation
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Not valid url';
    }
  }

  // social validation
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not valid url';
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not valid url';
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not valid url';
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not valid url';
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not valid url';
    }
  }
  if (!isEmpty(data.steam)) {
    if (!Validator.isURL(data.steam)) {
      errors.steam = 'Not valid url';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}