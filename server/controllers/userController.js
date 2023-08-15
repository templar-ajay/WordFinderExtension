const userSchema = require("../models/userSchema.js");
const otpManager = require("../services/otpManager.js");
const validator = require("../services/validator.js");
const SendMail = require("../services/mailer.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  static getUsers(req, res) {
    userSchema
      .find()
      .select(req.body.select ? req.body.select : "_id name email password otp")
      .then((users) => res.send({ total: users.length, data: users }))
      .catch((err) =>
        res.send({ error: err, TimeStamp: Date(), message: "error: UserController.getUser" })
      );
  }

  static async loginUser(req, res) {
    const { email, name, password } = req.body;

    try {
      const user = await userSchema.findOne({ $or: [{ email: email }, { name: name }] });
      if (!user || user.otp) return res.status(404).send({ message: "User not found" });

      const validCredentials = await bcrypt.compare(password, user.password);
      if (!validCredentials) return res.status(401).send({ message: "Wrong Password" });

      const accessToken = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.TOKEN_SECRET, {
        expiresIn: "7d"
      });
      res
        .cookie("authToken", accessToken, {
          sameSite: "strict",
          path: "/",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: true
        })
        .send({ data: user, message: "Login Success" });
    } catch (err) {
      res.send({ error: err, TimeStamp: Date(), message: "error: UserController.loginUser" });
    }
  }

  static logoutUser(req, res) {
    res.clearCookie("authToken").send({ message: "token removed success" });
  }

  static async createUser(req, res) {
    try {
      if (validator.checkWeakPassword(req, res) || (await validator.checkUserExisted(req, res)))
        return;

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const randomNum = Math.floor(Math.random() * 1000000).toString();
      const otp =
        randomNum.length < 6 ? randomNum + Math.floor(Math.random() * 10).toString() : randomNum;
      const user = await new userSchema({ ...req.body, password: hashedPassword, otp: otp });

      await SendMail(
        process.env.APP_ID,
        process.env.APP_PASSWORD,
        user.email,
        "Otp for verify your email address",
        `<h1>Word Finder</h1><br/>
        <h3>Your otp(One Time Password) is ${otp} </h3><br/>
        <h4>This otp is expired in 2 minutes</h4><br/>
        <h5>We hope you find our service cool.</h5><br/>`
      );
      await user.save();
      otpManager.otpCleaner(125000, user);
      res.send({ data: user, message: "Please verify email using otp sent to your mail address" });
    } catch (error) {
      res.send({ error: error, TimeStamp: Date(), message: "error: UserController.createUser" });
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      if (!otp || !email)
        return res.send({
          message: "Validation Error",
          error: { message: "Otp & email are required." }
        });

      const report = await otpManager.checkOtp(email, otp);
      res.send(
        !report && report.message.includes("success")
          ? { data: report, message: "email verification success" }
          : report
      );
    } catch (error) {
      res.send({ error: error, TimeStamp: Date(), message: "error: UserController.createUser" });
    }
  }
}

module.exports = UserController;
