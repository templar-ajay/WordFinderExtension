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
  }
};
