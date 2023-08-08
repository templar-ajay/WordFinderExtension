const userSchema = require("../models/userSchema.js");
const validator = require("../services/validator.js");
const bcrypt = require("bcrypt");

class UserController {
  static getUsers(req, res) {
    userSchema
      .find()
      .select(req.body.select ? req.body.select : "_id name email password")
      .then((users) => res.send({ total: users.length, data: users }))
      .catch((err) =>
        res.send({ error: err, TimeStamp: Date(), message: "error: UserController.getUser" })
      );
  }

  static async loginUser(req, res) {
    const { email, name, password } = req.body;

    try {
      const matchedUser = await userSchema.findOne({ $or: [{ email: email }, { name: name }] });
      if (!matchedUser || matchedUser.otp) return res.status(404).send("User not found");

      matchedUser.password === password
        ? res.send({ data: matchedUser, message: "Login Success" })
        : res.send({ message: "Wrong Password" });
    } catch (err) {
      res.send({ error: err, TimeStamp: Date(), message: "error: UserController.loginUser" });
    }
  }

  static async createUser(req, res) {
    try {
      if (validator.checkWeakPassword(req, res) || (await validator.checkUserExisted(req, res)))
        return;

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      console.log("aaya");
      const user = await new userSchema({ ...req.body, password: hashedPassword });

      await user.save();
      res.send({ data: user, message: "user registration success" });
    } catch (error) {
      res.send({ error: error, TimeStamp: Date(), message: "error: UserController.createUser" });
    }
  }
}

module.exports = UserController;
