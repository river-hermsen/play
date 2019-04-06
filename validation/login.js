const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email address is not valid";
  }

  if (Validator.isEmpty(data.pwd)) {
    errors.password = "Password can not be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
