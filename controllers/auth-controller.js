const UserModel = require("../models/user-model");
const AdminModel = require("../models/admin-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  getUserDetails: async function (userId) {
    const user = await UserModel.findOne({ userId }).lean();
    // .populate("products.product")

    // if (!user) {
    //   let user = { products: [] };
    //   return user;
    // }

    return user;
  },
  doLogin: async function (req, isAdmin = false) {
    const { email, password } = req.body;
    let Model,
      loginStatus = {};

    if (!email || !password)
      return (loginStatus = {
        success: false,
        msg: "user name or password not found",
      });

    if (isAdmin) {
      Model = AdminModel;
    } else {
      Model = UserModel;
    }

    let newuser = await Model.findOne({ email: email })
      .select("+password")
      .lean();

    if (!newuser)
      return (loginStatus = {
        success: false,
        msg: "User Name or Password invalid",
      });

    // const { password: _, ...newuser2 } = newuser;

    test = await bcrypt.compare(password, newuser.password);
    delete newuser.password;

    if (!test)
      return (loginStatus = {
        success: false,
        msg: "User Name or Password invalid",
      });

    return (loginStatus = { ...newuser, success: true });
  },

  doRegister: async function (req, isAdmin = false) {
    let Model,
      user = {};

    if (isAdmin) {
      Model = AdminModel;
    } else {
      Model = UserModel;
    }

    try {
      user = await Model.create({
        fullName: req.body.fullName,
        mobile: req.body.mobile,
        email: req.body.email,
        password: req.body.password,
      });
      // $push: { addresses: { city: "city " + Math.random() } },

      user.success = true;
    } catch (error) {
      user.error = error;
      user.success = false;
    }

    return user;
  },

  createToken: function (userID) {
    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return token;
  },

  updateDBField: function () {
    UserModel.updateMany(
      {},
      {
        active: true,
        flagged: false,
        createDate: Date.now(),
        cart: { count: 0 },
        wishList: { count: 0 },
      },
      { multi: true },
      (err, res) => {
        if (err) {
        }
      }
    );
  },
};
