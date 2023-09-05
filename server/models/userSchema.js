const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, "Name is too short!"],
    maxLength: [55, "Name is too long!"],
    required: [true, "Name is required field!"]
  },
  password: { type: String, required: [true, "Password is required field!"] },
  email: {
    type: String,
    minLength: 5,
    maxLength: 50,
    required: [true, "Email is required field!"]
  },
  otp: { type: Number }
});

module.exports = mongoose.model("users", userSchema);
