//jshint esversion:8
const jwt = require("jsonwebtoken"),
  express = require("express");

const { Authenticate } = require("./auth");

if (express().get("env") === "development") require("dotenv/config");
// express().use(express.json)
function auth(req, res, next) {
  try {
    // const data = Authenticate.verifyToken(req.params.token);
    req.headers.data = data;
    next();
  } catch (err) {
    res.render("auth", {
      msg: "Incorrect or expired link",
      page: "registeration page",
    });
    console.error(err.message);
    res.status(403);
  }
}

async function init(req, res, next) {}
module.exports = { auth, init };
