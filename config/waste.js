/*
const auth = require("./auth-controller");
const UserModel = require("../models/user-model");

module.exports = {
  adminRouteHandler: (req, res, next) => {
    if (req.session.adminLoggedIn) {
      return next();
    } else {
      res.render("admin/login", {
        title: "login page",
        layout: "admin-layout",
        noHeaders: true,
      });
    }
  },
  getLoginHandler: (req, res) => {
    if (req.session.adminLoggedIn) {
      res.redirect("/admin");
    }
    res.render("admin/login", {
      title: "login page",
      layout: "admin-layout",
      noHeaders: true,
    });
  },
  postLoginHandler: async (req, res, next) => {
    const user = await auth.doLogin(req, true);
    if (!user.success) {
      const msg = user.msg;
      return res.render("admin/login", {
        msg,
        title: "login page",
        layout: "admin-layout",
        noHeaders: true,
      });
    }

    const token = auth.createToken(user._id);
    req.session.adminLoggedIn = true;
    res.redirect("/admin");
  },
  getRegisterHandler: (req, res, next) => {
    res.render("admin/register", {
      title: "register page",
      layout: "admin-layout",
      noHeaders: true,
    });
  },
  postRegisterHandler: async (req, res) => {
    const user = await auth.doRegister(req, true);

    if (!user.success) {
      const msg = user.error;
      return res.render("admin/register", {
        msg,
        title: "Register page",
        layout: "admin-layout",
        noHeaders: true,
      });
    }

    const token = auth.createToken(user._id);
    req.session.adminLoggedIn = true;
    res.redirect("/admin");
  },
  //////////////////////////////////////
  getAllUsers: async function (req, res, msg) {
    const users = await UserModel.find().lean();
    return res.render("admin/all-users", {
      users,
      msg,
      title: "Users Panel",
      layout: "admin-layout",
    });
  },

  getAllProducts: async function (req, res, msg) {
    const products = {};
    return res.render("admin/all-products", {
      products,
      msg,
      title: "Products Panel",
      layout: "admin-layout",
    });
  },

  getAllCategories: async function (req, res, msg) {
    const categories = {};
    return res.render("admin/all-categories", {
      categories,
      msg,
      title: "Categories Panel",
      layout: "admin-layout",
    });
  },

  getAllOrders: async function (req, res, msg) {
    const orders = {};
    return res.render("admin/all-orders", {
      orders,
      msg,
      title: "Orders Panel",
      layout: "admin-layout",
    });
  },
  ////////////////////////////////////
  addUser: async function (req, res) {
    const user = await auth.doRegister(req);
    let msg;

    if (!user.success) {
      msg = user.error;
      return this.getAddUser(req, res, msg);
    }
    msg = "User Successfully Added";
    return this.getAllUsers(req, res, msg);
  },
  addProduct: (req, res) => {},
  addCategory: (req, res) => {},
  addOrder: (req, res) => {},

  ///////////////////////////////////
  getAddUser: function (req, res, msg) {
    return res.render("admin/add-user", {
      msg,
      title: "Add User",
      layout: "admin-layout",
    });
  },
  getAddProduct: (req, res, msg) => {
    return res.render("admin/add-product", {
      title: "Add Product",
      layout: "admin-layout",
    });
  },
  getAddCategory: (req, res, msg) => {
    return res.render("admin/add-category", {
      title: "Add Category",
      layout: "admin-layout",
    });
  },
  getAddOrder: (req, res, msg) => {
    return res.render("admin/add-order", {
      title: "Add Order",
      layout: "admin-layout",
    });
  },
  /////////////////////////////
  getTestHandler: (req, res) => {
    res.render("admin/index", {
      title: "home page",
      layout: "admin-layout",
    });
  },
};
*/
