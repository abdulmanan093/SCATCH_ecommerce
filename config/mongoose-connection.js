const mongoose = require("mongoose");
const config = require("config");

const dbgr = require("debug")("production:mongoose");

const mongo_URI = process.env.MONGO_CONN;

mongoose
  .connect(mongo_URI)
  .then(function () {
    dbgr("connected");
  })
  .catch(function (err) {
    console.log(err);
  });

module.exports = mongoose.connection;
