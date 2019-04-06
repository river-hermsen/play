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

// @router  POST api/users/signup
// @desc    Sign up route
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
          .then(user =>
            res.json({ username: newUser.username, email: newUser.email })
          )
          .catch(err => console.log(err));
      });
    });
  });
});

// @router  POST api/users/login
// @desc    Login route
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  console.log(isValid);

  const email = req.body.email;
  const pwd = req.body.pwd;
  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      console.log("No user with that email is");

      errors.user = "No user with that email is found";
      return res.status(400).json(errors);
    }

    bcrypt.compare(pwd, user.password).then(isMatch => {
      if (!isMatch) {
        errors.pwd = "Password incorrect";
        return res.status(400).json(errors);
      }

      const payload = {
        id: user.id,
        name: user.name
      };

      jwt.sign(payload, keys.secretOrKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          errors.pwd = "Something went wrong at the server";
          return res.status(500).json(errors);
        } else {
          console.log("returnting jwt");
          return res.status(200).json({
            username: user.username,
            email: user.email,
            token: "Bearer " + token
          });
        }
      });
    });
  });
});

// @router  POST api/users/getuser
// @desc    Login route
// @access  Public

module.exports = router;
