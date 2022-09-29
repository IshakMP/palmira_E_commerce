const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
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
        addedAt: {
          type: Date,
          default: Date.now(),
          // select: false,
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

const WishList = mongoose.model("WishList", wishListSchema);
module.exports = WishList;
