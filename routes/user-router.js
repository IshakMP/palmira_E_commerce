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
///////////////////////////////////////
router.get("/cart", utils.checkSession, userCtrl.getCart);
router.get("/wish-list", utils.checkSession, userCtrl.getWishList);
router.get("/checkout", utils.checkSession, userCtrl.getCheckout);
router.get("/profile", utils.checkSession, userCtrl.getProfile);

///////////////////////////////////////
router.get("/add-to-cart/:id?", utils.checkSession, userCtrl.postAddtoCart);
router.post("/add-to-cart", utils.checkSession, userCtrl.apiAddtoCart);
router.post("/add-item-qty", utils.checkSession, userCtrl.apiAddtoCart);
router.post(
  "/delete-from-cart",
  utils.checkSession,
  userCtrl.apideleteFromCart
);
/////////////////////////////////////
router.post("/add-to-wish-list", utils.checkSession, userCtrl.apiAddtoWishlist);
module.exports = router;
