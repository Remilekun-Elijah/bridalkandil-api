var express = require("express");
var router = express.Router(),
  jwt = require("jsonwebtoken"),
  { Authenticate } = require("../controller/auth"),
  { validate, isLoggedIn } = require("../controller/helper");

if (express().get("env") === "development") require("dotenv/config");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  // localStorage = new LocalStorage('./localStorage');
}

/* GET home page. */
router.get("/", function (req, res) {
  res.json({ status: 200, ok: true, msg: "Welcome to bridalkandil API v1" });
});

module.exports = router;
