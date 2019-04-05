const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateSignUpInput = require("../../validation/signUp");
const validateLoginInput = require("../../validation/login");

//Load User model
const User = require("../../models/User");

// @router  GET api/users/test
// @desc    Test User route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works"
  })
);

// @router  GET api/users/signup
// @desc    Register route
// @access  Public
router.post("/signup", (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    // Checking if user already exits with that email
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    // Creating new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.pwd1
    });

    // Salting and hashing new users password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json({ username, email }))
          .catch(err => console.log(err));
      });
    });
  });
});
module.exports = router;
