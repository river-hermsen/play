const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateSignUpInput(data) {
  let errors = {};
  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "Username must be between 2 and 30 characters";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email address is not valid";
  }

  if (!Validator.isLength(data.pwd1, { min: 6, max: 32 })) {
    errors.password = "Password must be between 6 and 32 characters";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
