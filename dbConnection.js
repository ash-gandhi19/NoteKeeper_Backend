const mongoose = require("mongoose");
require("dotenv").config();

const connectionDB = async () => {
  var conn = await mongoose.connect(process.env.MONGO_URL);
  await console.log(`conected to host : ${conn.connection.host}`);
};

module.exports = connectionDB;
