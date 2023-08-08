const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, "Name is too short!"],
    maxLength: [55, "Name is too long!"],
    required: true
  },
  password: { type: String, required: true },
  email: { type: String, minLength: 5, maxLength: 50, required: true },
  otp: { type: Number }
});

module.exports = mongoose.model("users", userSchema);
