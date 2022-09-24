const auth = require("./auth-controller");
const ProductModel = require("../models/product-model");
const CartModel = require("../models/cart-model");
const controller = require("./admin-controller");

const userController = {
  addToCart: async function (userId, productId) {
    console.log("correct function ethi--------------------");

    let cart = await CartModel.findOne({ userId });
    if (cart) {
      // let productIndex = cart.products.findIndex((i) => i.product == productId);
      let productIndex = await CartModel.findOne({
        userId,
        "products.product": productId,
      });

      if (productIndex) {
        await CartModel.updateOne(
          { userId: userId, "products.product": productId },
          {
            $inc: { "products.$.Qty": 1 },
          }
        );
      } else {
        await CartModel.findOneAndUpdate(
          { userId: userId },
          {
            $push: { products: { product: productId } },
          }
        );
      }
    } else {
      const cart = await CartModel.create({
        userId: userId,
        products: { product: productId },
      });
    }
    cart = await CartModel.findOne({ userId }).lean();
    console.log(cart);

    return cart;
  },

  getLoginHandler(req, res) {
    if (req.session.loggedIn) {
      return res.redirect("/");
    }
    res.render("user/login", {
      title: "login page",
      noHeaders: true,
    });
  },

  async postLoginHandler(req, res) {
    const user = await auth.doLogin(req);

    if (!user.success) {
      const msg = user.msg;
      return res.render("user/login", {
        msg,
        title: "login page",
        noHeaders: true,
      });
    }

    const token = auth.createToken(user._id);
    req.session.loggedIn = true;
    req.session.user = user;
    req.session.user.id = user._id;

    url = req.session.redirectUrl || "/";
    res.redirect(url);
  },

  getRegisterHandler(req, res) {
    if (req.session.loggedIn) {
      return res.redirect("/");
    }
    res.render("./user/register", {
      title: "login page",
      noHeaders: true,
    });
  },

  async postRegisterHandler(req, res) {
    const user = await auth.doRegister(req);

    if (!user.success) {
      const msg = user.error;
      return res.render("user/register", {
        msg,
        title: "login page",
        noHeaders: true,
      });
    }

    const token = auth.createToken(user._id);
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/");
  },

  getLogOutHandler(req, res) {
    if (req.session.loggedIn) {
      req.session.loggedIn = false;
    }
    res.redirect("/");
  },

  //////////////////////////////////
  async getIndex(req, res) {
    return res.render("index", {
      loggedIn: req.session.loggedIn,
      // user,
      title: "User Home",
    });
  },

  async getShop(req, res) {
    const products = await ProductModel.find().lean();

    return res.render("shop", {
      loggedIn: req.session.loggedIn,
      // user,
      products,
      title: "User shop",
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
    const cart = await CartModel.findOne({ userId: req.session.user.id })
      .populate("products.product")
      .lean();
    // console.log(cart.products[1].product);
    // const products = await ProductModel.find().lean();
    // console.log(products, "products");

    return res.render("user/cart", {
      loggedIn: req.session.loggedIn,
      // user,
      // products,
      cart,
      title: "User Cart",
    });
  },

  async getWishList(req, res) {
    const products = await ProductModel.find().lean();

    return res.render("/user/cart", {
      loggedIn: req.session.loggedIn,
      // user,
      products,
      title: "User Cart",
    });
  },

  postAddtoCart: async function (req, res) {
    console.log("post add ethi--------------------");

    const userId = req.session.user.id;
    const productId = req.params.id;
    const cart = await userController.addToCart(userId, productId);
    // let productdetails;
    // cart.products.forEach((product, i) => {
    //   productdetails[i] = await;
    // });

    // const products = await ProductModel.find().lean();
    return res.render("user/cart", {
      loggedIn: req.session.loggedIn,
      // products,
      title: "User Cart",
    });
  },

  apiAddtoCart: async function (req, res) {
    console.log("function ethi--------------------");
    const userId = req.session.user.id;
    const productId = req.body.productId;
    console.log(req.body);
    try {
      const cart = await userController.addToCart(userId, productId);
      return res.status(200).json({ message: "server Success" });
    } catch (error) {
      res.status(401).json({ message: "server failure" });
    }
    // let productdetails;
    // cart.products.forEach((product, i) => {
    //   productdetails[i] = await;
    // });

    // const products = await ProductModel.find().lean();
  },

  ////

  ////

  /////////////////////////////
  createCart(userID) {},

  //////////////////////////////

  getTestHandler(req, res) {
    res.json({ message: "shop", req: null });
  },
};

module.exports = userController;
