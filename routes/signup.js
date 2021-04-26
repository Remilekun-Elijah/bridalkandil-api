const userMailer = require("../controller/userMailer"),
  api = require("express").Router(),
  { init, auth } = require("../controller/authenticate"),
  { validate, isLoggedIn } = require("../controller/helper"),
  { Authenticate } = require("../controller/auth");
let token;

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./localStorage");
}

api.post(
  "/create-account",
  async (req, res, next) => {
    try {
      const { name, email, number, password } = req.body;
      // console.log(req.body);
      // const helper = new helper();
      console.log(validate().pwd(password));
      console.log(validate().num(number));
      console.log(validate().isEmpty(name));
      if (
        validate().pwd(password) &&
        validate().num(number) &&
        validate().isEmpty(name) == false
      ) {
        // console.log(await isLoggedIn(req.body));
        if ((await isLoggedIn(req.body)) === null) {
          hashedPassword = await bcrypt.hashSync(password, 10);

          const newUser = new users({
            name,
            email,
            number: { primary: number },
            password: hashedPassword,
          });

          // const userData = await newUser.save();

          let data = await newUser.save();
          console.log(data);
          req.headers.token = Authenticate.createToken(req.body);
          console.log(req.headers.token);
          next();

          // }
          // }
        } else {
          console.log("User already existed");
          res
            .status(400)
            .json({ msg: "User with this email address already exist" });
        }
      } else {
        res
          .status(400)
          .json({ msg: "Error! you have one or more incorrect field" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something went wrong please try again." });
    }
  },
  userMailer
);

module.exports = api;
