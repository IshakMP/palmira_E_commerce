const mongoose = require("mongoose");
// const validator = require("validator");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Specify the Name"],
    },
    brandName: {
      type: String,
      required: [true, "Specify the Brand"],
    },
    rating: {
      type: Number,
      default: 4.2,
    },
    category: {
      type: String,
      required: [true, "Specify the category"],
    },
    description: {
      type: String,
      required: [true, "Specify the Description"],
    },
    stock: {
      type: Number,
      required: [true, "Specify the Stock count"],
    },
    price: {
      type: Number,
      required: [true, "Specify the Amount"],
    },
    discount: {
      type: Number,
      default: 10,
    },
    imagesPath: {
      type: Array,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
