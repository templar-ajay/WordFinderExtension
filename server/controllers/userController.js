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
}

module.exports = UserController;
