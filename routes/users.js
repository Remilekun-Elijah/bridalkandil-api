//jshint esversion:8
const express = require("express"),
  userMailer = require("../controller/userMailer"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  saltRounds = 10,
  { isLoggedIn } = require("../controller/helper");
const { Authenticate } = require("../controller/auth");

let token;

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./localStorage");
}

if (express().get("env") === "development") require("dotenv/config");

// const { json } = require("express");
const DB = require("../controller/database"),
  db = new DB();
users = DB.model("user", db.userSchema);
const router = express.Router();
/* GET users listing. */
router
  .get("/", function (req, res, next) {
    // res.send('respond with a resource');
  })
  // .post("/create-account", init, mailer, async(req, res) => {
  //
  //     res.status(201).json({ data: "Account created successfully" });
  //
  // })
  .get(
    "/create-account/authentication/:token",
    Authenticate.verifyToken,
    async (req, res) => {
      try {
        // } else if (type === "Seller") {
        //     if (newseller === null) {
        //         const newSeller = new sellers({
        //             name,
        //             email,
        //             number: { primary: number },
        //             password: hashedPassword,
        //             type
        //         });

        //         user = await newSeller.save();

        //         res.render("auth", { msg: "Thanks for activating your account", page: "login page" });
        //     } else {
        //         res.render("auth", { msg: "Your account is already activated", page: false });
        //     }
        // }
        const { isActive, id } = await isLoggedIn(req.params.token);
        console.log(req.headers.token);
        if (isActive === false) {
          users.findByIdAndUpdate({ id: id }, { isActive: true });
          res.render("auth", {
            msg: "Thanks for activating your account",
            page: "login page",
          });
        } else {
          res.render("auth", {
            msg: "Your account is already activated",
            page: false,
          });
        }
        req.headers.token = "";
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Something went wrong please try again." });
      }
    }
  )
  .post("/login/forgot-password", async (req, res) => {
    try {
      console.log(localStorage);
      let mailer = require("../controller/mailer");
      let { email, origin } = req.body;

      let token = jwt.sign({ email }, process.env.JWT_SECRET);

      req.headers.token = token;
      console.log(token);
      // req.headers.token = "reset-password";
      let link = `${origin}/${token}`;
      await mailer(req, {
        name: email,
        email,
        msg: "kindly use the button below to reset your password",
        title: "Reset password",
        url: link,
      });

      res.status(202).json({ msg: "Request received." });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ msg: "Something went wrong" });
    }
  });

module.exports = router;
