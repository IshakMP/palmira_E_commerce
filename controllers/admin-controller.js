const auth = require("./auth-controller");
const UserModel = require("../models/user-model");
const ProductModel = require("../models/product-model");

const adminController = {
  adminRouteHandler: function (req, res, next) {
    if (req.session.adminLoggedIn) {
      return next();
    } else if (req.url == "/admin/login") {
      return next();
    } else {
      return res.render("admin/login", {
        title: "login page",
        layout: "admin-layout",
        noHeaders: true,
      });
    }
  },
  getLoginHandler: function (req, res) {
    if (req.session.adminLoggedIn) {
      res.redirect("/admin");
    }
    res.render("admin/login", {
      title: "login page",
      layout: "admin-layout",
      noHeaders: true,
    });
  },
  postLoginHandler: async function (req, res, next) {
    const admin = await auth.doLogin(req, true);
    if (!admin.success) {
      const msg = admin.msg;
      return res.render("admin/login", {
        msg,
        title: "login page",
        layout: "admin-layout",
        noHeaders: true,
      });
    }

    const token = auth.createToken(admin._id);
    req.session.adminLoggedIn = true;
    req.session.admin = admin;
    res.redirect("/admin");
  },
  getRegisterHandler: function (req, res, next) {
    res.render("admin/register", {
      title: "register page",
      layout: "admin-layout",
      noHeaders: true,
    });
  },
  postRegisterHandler: async function (req, res) {
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
    req.session.admin = admin;
    res.redirect("/admin");
  },
  //////////////////////////////////////
  getAllUsers: async function (req, res, msg) {
    const users = await UserModel.find().lean();
    if (typeof msg === "function") msg = null;

    return res.render("admin/sections/all-users", {
      users,
      msg,
      title: "Users Panel",
      layout: "admin-layout",
    });
  },

  getAllProducts: async function (req, res, msg) {
    const products = await ProductModel.find().lean();
    if (typeof msg === "function") msg = null;

    return res.render("admin/sections/all-products", {
      products,
      msg,
      title: "products Panel",
      layout: "admin-layout",
    });
  },

  getAllCategories: async function (req, res, msg) {
    const categories = {};
    return res.render("admin/sections/all-categories", {
      categories,
      msg,
      title: "Categories Panel",
      layout: "admin-layout",
    });
  },

  getAllOrders: async function (req, res, msg) {
    const orders = {};
    return res.render("admin/sections/all-orders", {
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
      return adminController.getAddUser(req, res, msg);
    }
    msg = "User Successfully Added";
    return adminController.getAllUsers(req, res, msg);
  },
  addProduct: async function (req, res) {
    let product = {},
      msg;

    const files = req.files;
    let imagesPath = files.map((el) => el.filename);
    req.body.imagesPath = imagesPath;

    try {
      product = await ProductModel.create(req.body);
    } catch (error) {
      msg = product.error = error;
      return adminController.getAddProduct(req, res, msg);
    }

    msg = "Product Successfully Added";
    return adminController.getAllProducts(req, res, msg);
  },
  addCategory: function (req, res) {},
  addOrder: function (req, res) {},

  ///////////////////////////////////
  getAddUser: function (req, res, msg) {
    if (typeof msg === "function") msg = null;
    return res.render("admin/sections/add-user", {
      msg,
      title: "Add User",
      layout: "admin-layout",
    });
  },
  getAddProduct: function (req, res, msg) {
    if (typeof msg === "function") msg = null;

    return res.render("admin/sections/add-product", {
      msg,
      title: "Add Product",
      layout: "admin-layout",
    });
  },
  getAddCategory: function (req, res, msg) {
    return res.render("admin/sections/add-category", {
      title: "Add Category",
      layout: "admin-layout",
    });
  },
  getAddOrder: function (req, res, msg) {
    return res.render("admin/sections/add-order", {
      title: "Add Order",
      layout: "admin-layout",
    });
  },
  /////////////////////////////
  getEditUser: async function (req, res, msg) {
    const Userid = req.params.id;
    const user = await UserModel.findById(Userid).lean();
    if (typeof msg === "function") msg = null;

    return res.render("admin/sections/edit-user", {
      user,
      msg,
      title: "Edit User",
      layout: "admin-layout",
    });
  },
  getEditProduct: async function (req, res, msg) {
    const Productid = req.params.id;
    const product = await ProductModel.findById(Productid).lean();
    if (typeof msg === "function") msg = null;

    return res.render("admin/sections/edit-product", {
      product,
      msg,
      title: "Edit Product",
      layout: "admin-layout",
    });
  },
  ////////////////////////////
  editUser: async function (req, res) {
    let Userid = req.params.id,
      user = {};

    try {
      user = await UserModel.findByIdAndUpdate(Userid, req.body).lean();
      user.success = true;
    } catch (error) {
      user.error = error;
      user.success = false;
    }

    let msg;

    if (!user.success) {
      msg = user.error;
      return adminController.getEditUser(req, res, msg);
    }
    msg = "User Successfully Updated";
    return adminController.getAllUsers(req, res, msg);
  },
  editProduct: async function (req, res) {
    let Userid = req.params.id,
      user = {};

    try {
      user = await UserModel.findByIdAndUpdate(Userid, req.body).lean();
      user.success = true;
    } catch (error) {
      user.error = error;
      user.success = false;
    }

    let msg;

    if (!user.success) {
      msg = user.error;
      return adminController.getEditUser(req, res, msg);
    }
    msg = "User Successfully Updated";
    return adminController.getAllUsers(req, res, msg);
  },

  ///////////////////////////
  blockUser: async function (req, res) {
    let Userid = req.params.id,
      user = {},
      active = !(req.query.block === "true");

    try {
      user = await UserModel.findByIdAndUpdate(Userid, {
        active: active,
      }).lean();
      user.success = true;
    } catch (error) {
      user.error = error;
      user.success = false;
    }

    let msg;

    if (active) {
      msg = "User Successfully Unblocked";
    } else {
      msg = "User Successfully Blocked";
    }

    if (!user.success) {
      msg = user.error;
    }

    return adminController.getAllUsers(req, res, msg);
  },
  //////////////////////////
  getTestHandler: function (req, res) {
    res.render("admin/index", {
      title: "home page",
      layout: "admin-layout",
    });
  },
};

module.exports = adminController;
