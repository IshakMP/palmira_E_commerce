const ProductModel = require("../models/product-model");
const CartModel = require("../models/cart-model");
const WishlistModel = require("../models/wish-list-model");
const auth = require("./auth-controller");
const controller = require("./admin-controller");

const helpers = {};

const userController = {
  getCartDetails: async function (userId) {
    const cart = await CartModel.findOne({ userId })
      .populate("products.product")
      .lean();

    if (!cart) {
      let cart = { products: [] };
      return cart;
    }

    cart.count = cart.products.length;

    cart.products.forEach((e) => {
      e.amount = e.product.price * e.qty;
      e.discount = e.product.discount * e.qty;
      e.fAmount = e.amount - e.discount;
    });
    cart.subTotal = cart.products.reduce((a, b) => a + b.amount, 0);
    cart.discount = cart.products.reduce((a, b) => a + b.discount, 0);
    cart.total = cart.subTotal - cart.discount;

    return cart;
  },
  ///////// Cart Helpers /////////////////////////////

  addToCart: async function (userId, productId, qty) {
    qty = parseInt(qty) || 1;

    let cart = await CartModel.findOne({ userId });
    // cart.find query optional
    if (cart) {
      let hasProduct = await CartModel.findOne({
        userId,
        "products.product": productId,
      });
      // upsert true optional
      if (hasProduct) {
        await CartModel.updateOne(
          { userId: userId, "products.product": productId },
          { $inc: { "products.$.qty": qty } }
        );
      } else {
        await CartModel.updateOne(
          { userId: userId },
          { $push: { products: { product: productId, qty: qty } } }
        );
      }
    } else {
      await CartModel.create({
        userId: userId,
        products: { product: productId },
      });
    }

    return await userController.getCartDetails(userId);
  },

  deleteFromCart: async function (userId, productId) {
    let hasProduct = await CartModel.findOne({
      userId,
      "products.product": productId,
    });

    if (hasProduct) {
      await CartModel.updateOne(
        { userId },
        { $pull: { products: { product: productId } } }
      );
    } else {
      throw "Product is Not listed";
    }

    return await userController.getCartDetails(userId);
  },
  ///////////////////////////////
  getWishlistDetails: async function (userId) {
    const wishlist = await WishlistModel.findOne({ userId })
      .populate("products.product")
      .lean();

    if (!wishlist) {
      let wishlist = { products: [] };
      return wishlist;
    }

    wishlist.count = wishlist.products.length;
    return wishlist;
  },

  addToWishlist: async function (userId, productId) {
    let wishlist = await WishlistModel.findOne({ userId });
    if (wishlist) {
      let hasProduct = await WishlistModel.findOne({
        userId,
        "products.product": productId,
      });

      if (hasProduct) {
        console.log("product exists");
      } else {
        await WishlistModel.updateOne(
          { userId: userId },
          { $push: { products: { product: productId } } }
        );
      }
    } else {
      wishlist = await WishlistModel.create({
        userId: userId,
        products: { product: productId },
      });
    }

    return await userController.getWishlistDetails(userId);
  },

  deleteFromWishlist: async function (userId, productId) {
    let hasProduct = await WishlistModel.findOne({
      userId,
      "products.product": productId,
    });

    if (hasProduct) {
      await WishlistModel.updateOne(
        { userId },
        { $pull: { products: { product: productId } } }
      );
    } else {
      throw "Product is Not wishlisted";
    }

    return await userController.getWishlistDetails(userId);
  },
  ///////////////////////////////////////////
  getLoginHandler(req, res, msg) {
    if (typeof msg === "function") msg = null;

    if (req.session.loggedIn) {
      return res.redirect("/");
    }

    req.session.refUrl = req.query.refUrl;

    res.render("user/login", {
      // noHeaders: true,
      title: "login page",
      msg,
    });
  },

  async postLoginHandler(req, res) {
    const user = await auth.doLogin(req);

    if (!user.success) {
      const msg = user.msg;
      userController.getLoginHandler(req, res, msg);
      return;
    }

    const token = auth.createToken(user._id);
    req.session.loggedIn = true;
    req.session.user = user;
    req.session.user.id = user._id;
    url = req.session.refUrl || req.session.redirectUrl || "/";
    res.redirect(url);
  },
  ////////////////////////////////////////
  getRegisterHandler(req, res, msg) {
    if (typeof msg === "function") msg = null;

    if (req.session.loggedIn) {
      return res.redirect("/");
    }

    res.render("user/register", {
      // noHeaders: true,
      title: "Register",
      msg,
    });
  },

  async postRegisterHandler(req, res) {
    const user = await auth.doRegister(req);

    if (!user.success) {
      const msg = user.error;
      userController.getRegisterHandler(req, res, msg);
      return;
    }

    const token = auth.createToken(user._id);
    req.session.loggedIn = true;
    req.session.user = user;
    req.session.user.id = user._id;
    url = req.session.refUrl || req.session.redirectUrl || "/";
    res.redirect(url);
  },
  ///////////////////////////////////

  getLogOutHandler(req, res) {
    if (req.session.loggedIn) {
      req.session.loggedIn = false;
      req.session.user = null;
    }
    res.redirect("/");
  },

  //////////////////////////////////
  async getIndex(req, res) {
    return res.render("index", {
      loggedIn: req.session.loggedIn,
      user: req.session.user,
      title: "User Home",
    });
  },

  async getShop(req, res) {
    const products = await ProductModel.find().lean();

    return res.render("shop", {
      loggedIn: req.session.loggedIn,
      title: "User shop",
      user: req.session.user,
      products,
    });
  },

  async getViewProduct(req, res) {
    const productID = req.params.id;
    const product = await ProductModel.findById(productID).lean();

    return res.render("product-view", {
      loggedIn: req.session.loggedIn,
      product,
      title: product.name,
    });
  },

  async getCart(req, res) {
    const cart = await userController.getCartDetails(req.session.user.id);

    return res.render("user/cart", {
      loggedIn: req.session.loggedIn,
      user: req.session.user,
      cart,
      title: "User Cart",
    });
  },

  async getProfile(req, res) {
    const user = await auth.getUserDetails(req.session.user.id);

    return res.render("user/profile", {
      loggedIn: req.session.loggedIn,
      user: req.session.user.email,
      user,
      title: "User Profile",
    });
  },

  async getWishList(req, res) {
    const wishlist = await userController.getWishlistDetails(
      req.session.user.id
    );

    return res.render("user/wish-list", {
      loggedIn: req.session.loggedIn,
      user: req.session.user,
      wishlist,
      title: "User WishList",
    });
  },

  async getCheckout(req, res) {
    const user = req.session.user.addresses;
    const cart = userController.getCartDetails(req.session.user.id);

    // const products = await ProductModel.find().lean();

    return res.render("user/checkout", {
      loggedIn: req.session.loggedIn,
      user: req.session.user,
      title: "Check-Out",
    });
  },

  ////////////////////////////////////////////
  postAddtoCart: async function (req, res) {
    const userId = req.session.user.id;
    const productId = req.params.id;
    const qty = req.query.qty || 1;

    await userController.addToCart(userId, productId, qty);
    res.redirect("/cart");
  },

  apiAddtoCart: async function (req, res) {
    const userId = req.session.user.id;
    const productId = req.body.productId;
    const qty = req.body.qty || 1;

    try {
      const cart = await userController.addToCart(userId, productId, qty);
      return res
        .status(200)
        .json({ message: "Product added Successfully", cart });
    } catch (error) {
      res.status(401).json({ message: "Problem adding Product", error });
    }
  },

  apideleteFromCart: async function (req, res) {
    const userId = req.session.user.id;
    const productId = req.body.productId;

    try {
      const cart = await userController.deleteFromCart(userId, productId);
      return res
        .status(200)
        .json({ message: "Product deleted successfully", cart });
    } catch (error) {
      res.status(401).json({ message: "Problem deleting Product", error });
    }
  },

  //////////////////////////////////////////

  // postAddtoWishList: async function (req, res) {
  //   const userId = req.session.user.id;
  //   const productId = req.params.id;
  //   const cart = await userController.addToCart(userId, productId, qty);

  //   return res.render("user/cart", {
  //     loggedIn: req.session.loggedIn,
  //     // products,
  //     title: "User Cart",
  //   });
  // },

  apiAddtoWishlist: async function (req, res) {
    const userId = req.session.user.id;
    const productId = req.body.productId;

    try {
      const wishlist = await userController.addToWishlist(userId, productId);
      return res.status(200).json({ message: "Product wish-listed", wishlist });
    } catch (error) {
      res.status(401).json({ message: "Problem adding Product", error });
    }
  },

  apideleteFromWishlist: async function (req, res) {
    const userId = req.session.user.id;
    const productId = req.body.productId;

    try {
      const wishlist = await userController.deleteFromWishlist(
        userId,
        productId
      );
      return res
        .status(200)
        .json({ message: "Product removed from Wishlist", wishlist });
    } catch (error) {
      res
        .status(401)
        .json({ message: "Problem deleting from Wishlist", error });
    }
  },
  /////////////////////////////

  //////////////////////////////

  getTestHandler(req, res) {
    res.json({ message: "shop", req: null });
  },
};

module.exports = userController;
