const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const { host, port, name } = conn.connection;

    console.log("\x1b[34m%s\x1b[0m", `MongoDB Connected at mongodb://${host}/${port}, DB: ${name}`);
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", `Error: ${error}`);
    process.exit();
  }
};

module.exports = connectDb;
