const userSchema = require("../models/userSchema");

module.exports = {
  checkWeakPassword: function (req, res) {
    if (
      !RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})").test(req.body.password)
    ) {
      res.send({
        message: "Validation Error",
        error: {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long"
        }
      });
      return true;
    }
  },

  checkUserExisted: async function (req, res) {
    if (await userSchema.findOne({ email: req.body.email }))
      return res.send({
        message: "error: Invalid data",
        error: { message: "This email is already in use" }
      });
    if (await userSchema.findOne({ name: req.body.name }))
      return res.send({
        message: "error: Invalid data",
        error: { message: "This name is already in use" }
      });

    return false;
  }
};
