const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },


    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "active"],
      default: "draft",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    reviews: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Product",
    productSchema
  );