const jwt = require("jsonwebtoken"),
  express = require("express");

if (express().get("env") === "development") require("dotenv/config");

class Authenticate {
  static createToken(data) {
    let token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log(token);
    return token;
  }

  static verifyToken(req, res, next) {
    try {
      let token = jwt.verify(req.query.token, process.env.JWT_SECRET);
      // console.log(token);
      if (token) {
        req.header.token = token;
        let parsedToken = token;
        // console.log(parsedToken);
        next();
      }
    } catch (e) {
      console.log(e.message);
      res.status(403).json({ err: "Forbidden" });
    }
  }
}
module.exports.Authenticate = Authenticate;
