const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const hbs = require("handlebars");
const fs = require("fs");
// Load input validation
const validateSignUpInput = require("../../validation/signUp");
const validateLoginInput = require("../../validation/login");

//Load User model
const User = require("../../models/User");

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: keys.gmail.email,
    pass: keys.gmail.password
  }
});

// @router  POST api/users/signup
// @desc    Sign up route
// @access  Public
router.post("/signup", (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);
  if (!isValid) {
    console.error("\x1b[31m", "---------WRONG CREDENTIALS---------");
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
      password: req.body.pwd1,
      confirmEmailToken: crypto.randomBytes(16).toString("hex")
    });
    // Salting and hashing new users password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        console.log("---------HASHED PASSWORD-------------");
      });
      var template = fs.readFileSync(
        "././config/emails/confirmEmail.hbs",
        "utf-8"
      );
      var compiledTemplate = hbs.compile(template);
      const mailOptions = {
        from: "project.play19@gmail.com", // sender address
        to: "riverhermsen@hotmail.nl", // list of receivers
        subject: "Confirm Email", // Subject line
        html: compiledTemplate({
          username: newUser.username,
          linkToConfirm: `http://localhost:8080/confirmemail?token=${
            newUser.confirmEmailToken
          }&email=${newUser.email}`
        })
      };

      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          console.log(err);
          errors.mail = "Error sending confirmation email";
          return res.status(500).json(errors);
        } else {
          console.log(newUser);
          newUser.save().then(user => {
            res.json({
              username: newUser.username,
              email: newUser.email,
              status: "Validate email"
            });
          });
        }
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
      errors.user = "No user with that email is found";
      return res.status(400).json(errors);
    } else if (!user.emailConfirmed) {
      errors.user = "Please verify your email.";
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

// @router  POST api/users/confirmemail
// @desc    ConfirmEmail route
// @access  Public
router.post("/confirmemail", (req, res) => {
  const token = req.body.token;
  const email = req.body.email;

  if (token.length == 32 && email) {
    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(400).json({ error: "No email found." });
      }
      if (!user.confirmEmailToken == token) {
        return res.status(400).json({ error: "Wrong token." });
      }
      if (user.emailConfirmed == true) {
        return res
          .status(400)
          .json({ error: "Email has already been confirmed." });
      }

      user.emailConfirmed = true;
      user.confirmEmailToken = null;
      user.save(err => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ servererror: "Something went wrong please try again." });
        } else {
          return res.status(200).json({ success: "Email has been confirmed." });
        }
      });
    });
  }
});

// @router  POST api/users/forgotpassword
// @desc    Forgotpassword route
// @access  Public
router.post("/forgotpassword", (req, res) => {
  const email = req.body.email;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res
        .status(400)
        .json({ error: "No account with that email found" });
    }
    var template = fs.readFileSync(
      "././config/emails/forgotPassword.hbs",
      "utf-8"
    );
    var compiledTemplate = hbs.compile(template);
    const mailOptions = {
      from: "project.play19@gmail.com", // sender address
      to: "riverhermsen@hotmail.nl", // list of receivers
      subject: "Confirm Email", // Subject line
      html: compiledTemplate({
        username: newUser.username,
        linkToConfirm: `http://localhost:8080/changepassword?token=${
          newUser.confirmEmailToken
        }&email=${newUser.email}`
      })
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
        errors.mail = "Error sending confirmation email";
        return res.status(500).json(errors);
      } else {
        console.log(newUser);
        newUser.save().then(user => {
          res.json({
            username: newUser.username,
            email: newUser.email,
            status: "Validate email"
          });
        });
      }
    });
    var token = crypto.randomBytes(16).toString("hex");
    user.forgotPasswordToken = token;
  });
});

module.exports = router;
