var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var db = require("./config/connection");
var hbs = require("express-handlebars");
var session = require("express-session");
var app = express();

var indexRouter = require("./routes/index-router");
var usersRouter = require("./routes/user-router");
var adminRouter = require("./routes/admin-router");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    layoutsDir: __dirname + "/views/zlayouts",
    partialsDir: [__dirname + "views/"],
    defaultLayout: "user-layout.hbs",
    helpers: {
      formatDate: function (date) {
        newdate = date.toUTCString();
        return newdate.slice(0, 16);
      },
      plusOne: function (context) {
        return context + 1;
      },
    },
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "key",
    resave: true,
    saveUninitialized: false,
  })
);

app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/admin", adminRouter);

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
