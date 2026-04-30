const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: Number,
      },
    ],

    totalPrice: Number,

    status: {
      type: String,
      default: "pending", // pending | paid | shipped
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);