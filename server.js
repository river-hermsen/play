const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");

const app = express();

const cors = require("cors");
app.use(cors());
//Body Parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB CONFIG
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect("mongodb://admin:admin123@ds231549.mlab.com:31549/spotify-clone", {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());
//Passport Config
require("./config/passport")(passport);

//Use routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));
