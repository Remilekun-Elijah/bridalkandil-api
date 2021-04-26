var express = require("express");
if (express().get("env") === "development") require("dotenv/config");
var api = express.Router(),
  { Authenticate } = require("../controller/auth"),
  { validate, isLoggedIn } = require("../controller/helper"),
  DB = require("../controller/database"),
  db = new DB(),
  users = DB.model("user", db.userSchema);

api.put("/one", Authenticate.verifyToken, async (req, res) => {
  // const userData = decode.v;
  const userData = req.header.token.data;
  console.log(userData);
  let update = "";
  try {
    update =
      validate().num(req.body.number) && req.body.type == "primary"
        ? await users.findByIdAndUpdate(
            { _id: userData._id },
            { "number.primary": req.body.number }
          )
        : validate().num(req.body.number) && req.body.type == "secondary"
        ? await users.findByIdAndUpdate(
            { _id: userData._id },
            { "number.secondary": req.body.number }
          )
        : validate().num(req.body.number) && req.body.type == "other"
        ? await users.findByIdAndUpdate(
            { _id: userData._id },
            { "number.other": req.body.number }
          )
        : undefined;
    // number
    console.log(update);

    update =
      validate().isEmpty(req.body.name) && validate().isEmpty(req.body.email)
        ? await users.findByIdAndUpdate(
            { _id: userData._id },
            { name: req.body.name, email: req.body.email }
          )
        : validate().isEmpty(req.body.email)
        ? await users.findByIdAndUpdate(
            { _id: userData._id },
            { email: req.body.email }
          )
        : validate().isEmpty(req.body.name)
        ? await users.findByIdAndUpdate(
            { _id: userData._id },
            { name: req.body.name }
          )
        : undefined;

    // console.log(req.ip);
    if (update != "undefined") {
      res.status(201).json(Authenticate.createToken(await isLoggedIn(update)));
    } else {
      // res.status(400).json({ err: "Input is incorrect!" });
    }
  } catch (err) {
    console.log(err.message);
  }
  // console.log(decode.v);
});

api.get("/one", Authenticate.verifyToken, async (req, res, next) => {
  try {
    console.log(req.body);
    let data = req.header.token;

    if (await isLoggedIn(data.data)) {
      res.status(200).json({ data: await isLoggedIn(data.data) });
    }
  } catch (err) {
    console.error(err.message, req.status);
    res.status(403).json({ err: "Forbidden" });
  }
  next();
});

module.exports = api;
