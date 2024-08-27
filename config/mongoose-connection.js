const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");

const dbURI = process.env.MONGO_CONN;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    debug("Connected to MongoDB Atlas");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

module.exports = mongoose.connection;
