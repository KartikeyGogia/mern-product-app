const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    brand: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "General",
    },
    productType: {
      type: String,
      default: "General",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);