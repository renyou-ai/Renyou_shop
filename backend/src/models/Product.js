const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, default: "" },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },

    category: { type: String },

    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);