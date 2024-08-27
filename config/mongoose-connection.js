const mongoose = require("mongoose");

const mongo_URI = process.env.MONGO_CONN;

mongoose
  .connect(mongo_URI)
  .then(function () {
    console.log("connected");
  })
  .catch(function (err) {
    console.log(err);
  });

module.exports = mongoose.connection;
