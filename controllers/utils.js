const multer = require("multer");
const path = require("path");
const { nextTick } = require("process");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
/////////////////////////////
const checkUserSession = (req, res, next) => {
  if (req.session.loggedIn) return next();
  console.log("login false ethi--------------------");

  req.session.redirectUrl = req.originalUrl;
  res.redirect("/login");
};

const checkAdminSession = (req, res, next) => {
  if (req.session.adminLoggedIn) return next();
  res.redirect("/login");
};
exports.upload = upload;
exports.checkAdminSession = checkAdminSession;
exports.checkUserSession = checkUserSession;
