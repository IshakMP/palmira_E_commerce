var express = require("express");
var router = express.Router();
var userCtrl = require("../controllers/user-controller");
var utils = require("../controllers/utils");

router.get("/login", userCtrl.getLoginHandler);
router.post("/login", userCtrl.postLoginHandler);
router.get("/logout", userCtrl.getLogOutHandler);
router.get("/register", userCtrl.getRegisterHandler);
router.post("/register", userCtrl.postRegisterHandler);
router.get("/test", userCtrl.getTestHandler);
//////////////////////////////////////
router.get("/", userCtrl.getIndex);
router.get("/shop", userCtrl.getShop);
router.get("/view-product/:id?", userCtrl.getViewProduct);
router.get("/cart", utils.checkUserSession, userCtrl.getCart);
router.get("/wish-list", utils.checkUserSession, userCtrl.getWishList);

// router.get("/add-to-cart/:id?", utils.checkUserSession, userCtrl.postAddtoCart);
router.post("/add-to-cart", utils.checkUserSession, userCtrl.apiAddtoCart);

module.exports = router;
