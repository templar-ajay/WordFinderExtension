const userSchema = require("../models/userSchema");

module.exports = {
  checkWeakPassword: function (req, res) {
    if (
      !RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})").test(req.body.password)
    ) {
      res.status(403).send({
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
    const userByEmail = await userSchema.findOne({ email: req.body.email });
    if (userByEmail && !userByEmail.otp)
      return res.status(400).send({
        message: "error: Invalid data",
        error: { message: "This email is already in use" }
      });

    const userByName = await userSchema.findOne({ name: req.body.name });
    if (userByName && !userByName.otp)
      return res.status(400).send({
        message: "error: Invalid data",
        error: { message: "This name is already in use" }
      });

    if (userByEmail?.otp || userByName?.otp)
      await this.deleteNonTrustedUser(userByEmail?.otp ? userByEmail : userByName);

    return false;
  },

  deleteNonTrustedUser: async function (user) {
    await userSchema.deleteOne({ $or: [{ email: user.email }, { name: user.name }] });
  }
};
