const mongoose = require("mongoose");
const number = require("mongoose/lib/cast/number");

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
        qty: {
          type: Number,
          default: 1,
        },
        amount: {
          type: Number,
        },
        discount: {
          type: Number,
          default: 0,
        },
        fAmount: {
          type: Number,
        },
      },
    ],

    total: Number,
    count: Number,

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

// cartSchema.pre("save", function (next) {
//   this.count = this.products.length;
//   this.total = this.products.reduce((a, b) => a + b, 0);
//   next();
// });

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
