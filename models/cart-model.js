const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        Qty: {
          type: Number,
          default: 1,
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    ModifiedAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
