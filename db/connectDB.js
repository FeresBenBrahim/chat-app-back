const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();
const DB = process.env.database_secret;
const dbConnector = () => {
  mongoose
    .connect(DB)
    .then(() => {
      console.log("DB conenction successful!");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { dbConnector };