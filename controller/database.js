const mongoose = require("mongoose");
const users = require("../models/user");
class DB {
  constructor() {}
  static connect(conString) {
    mongoose.connect(conString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      // we're connected!
      console.log("database connected successfully");
    });
  }
  static model(collection_name, schema) {
    return mongoose.model(collection_name, schema);
  }
  // static userSchema() {
  //   return users;
  // }
}
DB.prototype.userSchema = users;

// console.log();
module.exports = DB;
