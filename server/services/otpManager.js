const userSchema = require("../models/userSchema");

module.exports = {
  otpCleaner: function (duration, userData) {
    setTimeout(() => {
      userSchema
        .deleteOne({ $and: [{ _id: userData._id }, { otp: userData.otp }] })
        .then((report) => console.log({ otpRemovalInfo: report }))
        .catch((err) => {
          console.log({
            error: { ...err, userId: userData._id },
            TimeStamp: Date(),
            message: "error: otpManager.otpCleaner"
          });
        });
    }, duration);
  },

  checkOtp: async function (email, otp) {
    try {
      const report = await userSchema.findOneAndUpdate(
        { $and: [{ email: email }, { otp: otp }] },
        { $unset: { otp: 1 } }
      );
      return { message: !report ? "OTP doesn't match" : "verification success", report: report };
    } catch (error) {
      return { error: error, TimeStamp: Date(), message: "error: otpManager.checkOtp" };
    }
  }
};
