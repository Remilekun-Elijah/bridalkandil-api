bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

let user = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: Object,
    trim: true,
    default: { primary: "", secondary: "", other: "" },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: Object,
    default: {
      home: "",
      office: "",
    },
  },
  image: {
    type: String
  },
  orders: {
    type: Schema.Types.ObjectId,
    ref: "./orders",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});
user
  .virtual("id")
  .get(function () {
    return this._id.toHexString();
  })
  .set("toJSON", {
    virtuals: true,
  });
module.exports = user;
