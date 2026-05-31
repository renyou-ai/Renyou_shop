// backend/src/models/Order.js

const mongoose =
  require("mongoose");

const orderSchema =
  new mongoose.Schema(
    {

      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      items: [
        {

          product: {
            type:
              mongoose.Schema
                .Types.ObjectId,

            ref: "Product",
          },

          name: String,

          image: String,

          price: Number,

          qty: Number,
        },
      ],

      shippingAddress: {

        fullName: String,

        phone: String,

        address: String,

        city: String,

        postalCode: String,

        country: String,
      },

      paymentMethod: {
        type: String,

        enum: [
          "cash",
          "online",
        ],

        default: "online",
      },

      orderStatus: {
        type: String,

        enum: [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],

        default: "pending",
      },

      totalPrice: {
        type: Number,
        required: true,
      },

      stripeSessionId:
        String,
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  ); 