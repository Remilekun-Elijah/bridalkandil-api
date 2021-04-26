express = require("express");
const users = require("../models/user");

module.exports = async function (email) {
  let checkEmail = await users.findOne({ email });

  console.log(checkEmail);
  // console.log(checkName)

  if (checkEmail === null) {
    return null;
  } else {
    return true;
  }
};
