const userSchema = require("../models/userSchema.js");

class UserController {
  static async getUsers(req, res) {
    await userSchema
      .find()
      .select(req.body.query ? req.body.query : "_id name email password")
      .then((users) => res.send({ total: users.length, data: users }))
      .catch((err) =>
        res.send({
          error: err,
          TimeStamp: Date(),
          handlerLocation: "UserController.getUser"
        })
      );
  }

  static async loginUser(req, res) {
    const { email, name, password } = req.body;

    try {
      const payload = await userSchema.findOne({
        $or: [{ email: email }, { name: name }]
      });
      if (!payload) return res.status(404).send("User not found");

      payload.password === password
        ? res.send({ data: payload, message: "Login Success" })
        : res.send({ message: "Wrong Password" });
    } catch (err) {
      res.send({ error: err });
    }
  }
}

module.exports = UserController;
