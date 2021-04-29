var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

if (express().get("env") === "development") require("dotenv/config");

require("./controller/database").connect(process.env.MONGODB_URI);

const indexRouter = require("./routes/index"),
  usersRouter = require("./routes/users"),
  loginRoute = require("./routes/login"),
  signupRoute = require("./routes/signup");
  getOneUserRoute = require("./routes/getOneUser"),
  imageUploadRoute = require("./routes/imageUpload");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// console.log(`${process.env.API_URI}/user`)
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(`/${process.env.API_URI}`, indexRouter);
app.use(`/${process.env.API_URI}/user`, usersRouter);
app.use(`/${process.env.API_URI}/user`, loginRoute);
app.use(`/${process.env.API_URI}/user`, signupRoute);
app.use(`/${process.env.API_URI}/user`, getOneUserRoute);
app.use(`/${process.env.API_URI}/user`, imageUploadRoute)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
