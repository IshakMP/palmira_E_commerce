const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      unique: [true, "should be unique"],
      required: [true, "Provide a first Name"],
    },
    // lastName: String,
    mobile: {
      type: String,
      unique: [true, "Mobile No already Exists"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already Exists"],
      validate: [validator.isEmail, "Provide a valid mail"],
    },
    password: {
      type: String,
      select: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    createDate: {
      type: Date,
      default: Date.now(),
    },
    cart: {
      type: Object,
      default: { count: 0 },
    },
    wishList: {
      type: Object,
      default: { count: 0 },
    },
    addresses: [
      {
        city: {
          type: String,
          default: "this.fullName",
        },
        street: {
          type: String,
          default: "Test Street",
        },
        houseNumber: {
          type: String,
          default: "Test House",
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw `bcrypt error ${error}`;
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
