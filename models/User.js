var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmEmailToken: {
    type: String
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  forgotPasswordToken: {
    type: String
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = User = mongoose.model("users", UserSchema);
