var express = require("express");
var router = express.Router();
var adminCtrl = require("../controllers/admin-controller");
var utils = require("../controllers/utils");
///////////////////

////////////////////

// router.use("/", adminCtrl.adminRouteHandler);
///////////////////////
router.get("/", adminCtrl.getTestHandler);
router.get("/login", adminCtrl.getLoginHandler);
router.post("/login", adminCtrl.postLoginHandler);
// router.get("/register", adminCtrl.getRegisterHandler);
// router.post("/register", adminCtrl.postRegisterHandler);
router.get("/test", adminCtrl.getTestHandler);
////////////////////////
router.get("/all-users", utils.checkAdminSession, adminCtrl.getAllUsers);
router.get("/all-products", adminCtrl.getAllProducts);
router.get("/all-categories", adminCtrl.getAllCategories);
router.get("/all-orders", adminCtrl.getAllOrders);
///////////////////////
router.get("/add-user", adminCtrl.getAddUser);
router.get("/add-product", adminCtrl.getAddProduct);
router.get("/add-category", adminCtrl.getAddCategory);
router.get("/add-order", adminCtrl.getAddOrder);
///////////////////////
router.post("/add-user", adminCtrl.addUser);
router.post(
  "/add-product",
  utils.upload.array("photos", 4),
  adminCtrl.addProduct
);
router.post("/add-category", adminCtrl.addCategory);
router.post("/add-order", adminCtrl.addOrder);
///////////////////////
router.get("/edit-user/:id", adminCtrl.getEditUser);
router.post("/edit-user/:id", adminCtrl.editUser);
router.get("/block-user/:id", adminCtrl.blockUser);
///////////////////////
router.get("/edit-product/:id", adminCtrl.getEditUser);
router.post("/edit-product/:id", adminCtrl.editUser);
router.get("/flag-product/:id", adminCtrl.blockUser);
router.get("/delete-product/:id", adminCtrl.blockUser);

// router.get("/edit-product", adminCtrl.getEditProduct);
// router.get("/edit-category", adminCtrl.getEditCategory);
// router.get("/edit-order", adminCtrl.getEditOrder);
/////////////////////////

module.exports = router;
