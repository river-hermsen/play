const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email address is not valid";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 32 })) {
    errors.password = "Password must be between 6 and 32 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
