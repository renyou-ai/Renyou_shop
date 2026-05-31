const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

/* =========================
   🟢 GET MY ORDERS
========================= */
exports.getMyOrders = async (
  req,
  res
) => {

  try {

    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    console.error(
      "❌ getMyOrders:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   🟢 GET ORDER BY SESSION
========================= */
exports.getOrderBySession =
  async (req, res) => {

    try {

      const { session_id } =
        req.query;

      if (!session_id) {

        return res
          .status(400)
          .json({
            message:
              "Session ID required",
          });
      }

      const order =
        await Order.findOne({
          stripeSessionId:
            session_id,
        }).populate(
          "items.product"
        );

      if (!order) {

        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });
      }

      res.json(order);

    } catch (error) {

      console.error(
        "❌ getOrderBySession:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching order",
      });
    }
  };

/* =========================
   🟢 STRIPE CHECKOUT
========================= */
exports.createCheckoutSession =
  async (req, res) => {

    try {

      const cart =
        await Cart.findOne({
          user:
            req.user.userId,
        }).populate(
          "items.product"
        );

      if (
        !cart ||
        cart.items.length === 0
      ) {

        return res
          .status(400)
          .json({
            message:
              "Cart is empty",
          });
      }

      const user =
        await User.findById(
          req.user.userId
        );

      if (
        !user?.shippingAddress
          ?.address
      ) {

        return res
          .status(400)
          .json({
            message:
              "Shipping address missing",
          });
      }

      const line_items =
        cart.items.map(
          (item) => {

            if (
              !item.product
            ) {

              throw new Error(
                "Product missing"
              );
            }

            return {

              price_data: {

                currency:
                  "usd",

                product_data:
                  {
                    name:
                      item.product
                        .name,
                  },

                unit_amount:
                  Math.round(
                    item.product
                      .price *
                      100
                  ),
              },

              quantity:
                item.qty,
            };
          }
        );

      const itemsSnapshot =
        cart.items.map(
          (item) => ({

            product:
              item.product._id.toString(),

            name:
              item.product.name,

            image:
              item.product
                .images?.[0] ||
              "",

            price:
              item.product.price,

            qty:
              item.qty,
          })
        );

      const totalPrice =
        itemsSnapshot.reduce(
          (acc, item) =>
            acc +
            item.price *
              item.qty,
          0
        );

      const session =
        await stripe.checkout.sessions.create(
          {

            payment_method_types:
              ["card"],

            line_items,

            mode:
              "payment",

            success_url:
              `${process.env.FRONTEND_URL}/success`,

            cancel_url:
              `${process.env.FRONTEND_URL}/checkout`,

            metadata: {

              userId:
                req.user
                  .userId,

              items:
                JSON.stringify(
                  itemsSnapshot
                ),

              totalPrice:
                totalPrice.toString(),

              shippingAddress:
                JSON.stringify(
                  user.shippingAddress
                ),
            },
          }
        );

      res.json({
        url: session.url,
      });

    } catch (error) {

      console.error(
        "❌ createCheckoutSession:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   🟢 CASH ORDER
========================= */
exports.createCashOrder =
  async (req, res) => {

    try {

      const cart =
        await Cart.findOne({
          user:
            req.user.userId,
        }).populate(
          "items.product"
        );

      if (
        !cart ||
        cart.items.length === 0
      ) {

        return res
          .status(400)
          .json({
            message:
              "Cart is empty",
          });
      }

      const user =
        await User.findById(
          req.user.userId
        );

      const items =
        cart.items.map(
          (item) => ({

            product:
              item.product._id,

            name:
              item.product.name,

            image:
              item.product
                .images?.[0] ||
              "",

            price:
              item.product.price,

            qty:
              item.qty,
          })
        );

      const totalPrice =
        items.reduce(
          (acc, item) =>
            acc +
            item.price *
              item.qty,
          0
        );

      const order =
        await Order.create({

          user:
            req.user.userId,

          items,

          shippingAddress:
            user.shippingAddress,

          paymentMethod:
            "cash",

          orderStatus:
            "pending",

          totalPrice,
        });

      // 🔥 STOCK UPDATE
      for (const item of items) {

        const product =
          await Product.findById(
            item.product
          );

        if (!product)
          continue;

        product.stock =
          Math.max(
            0,
            product.stock -
              item.qty
          );

        await product.save();
      }

      // 🔥 CLEAR CART
      await Cart.findOneAndUpdate(
        {
          user:
            req.user.userId,
        },
        {
          items: [],
        }
      );

      res.status(201).json({
        message:
          "Order created",

        order,
      });

    } catch (error) {

      console.error(
        "❌ createCashOrder:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   🟢 STRIPE WEBHOOK
========================= */
exports.stripeWebhook =
  async (req, res) => {

    let event;

    try {

      event =
        stripe.webhooks.constructEvent(
          req.body,
          req.headers[
            "stripe-signature"
          ],
          process.env
            .STRIPE_WEBHOOK_SECRET
        );

    } catch (err) {

      console.error(
        "❌ Webhook signature error:",
        err.message
      );

      return res
        .status(400)
        .send(
          `Webhook Error: ${err.message}`
        );
    }

    if (
      event.type ===
      "checkout.session.completed"
    ) {

      const session =
        event.data.object;

      try {

        const existingOrder =
          await Order.findOne({
            stripeSessionId:
              session.id,
          });

        if (
          existingOrder
        ) {

          return res.json({
            received: true,
          });
        }

        const userId =
          session.metadata
            .userId;

        const items =
          JSON.parse(
            session.metadata
              .items
          );

        const shippingAddress =
          JSON.parse(
            session.metadata
              .shippingAddress
          );

        const totalPrice =
          Number(
            session.metadata
              .totalPrice
          );

        await Order.create({

          user: userId,

          items,

          shippingAddress,

          paymentMethod:
            "online",

          orderStatus:
            "pending",

          totalPrice,

          stripeSessionId:
            session.id,
        });

        // 🔥 UPDATE STOCK
        for (const item of items) {

          const product =
            await Product.findById(
              item.product
            );

          if (!product)
            continue;

          product.stock =
            Math.max(
              0,
              product.stock -
                item.qty
            );

          await product.save();
        }

        // 🔥 CLEAR CART
        await Cart.findOneAndUpdate(
          {
            user: userId,
          },
          {
            items: [],
          }
        );

        console.log(
          "✅ Stripe order created"
        );

      } catch (err) {

        console.error(
          "❌ Webhook error:",
          err
        );
      }
    }

    res.json({
      received: true,
    });
  };

/* =========================
   🟢 BEST SELLERS
========================= */
exports.getBestSellers =
  async (req, res) => {

    try {

      const bestSellers =
        await Order.aggregate([
          {
            $unwind:
              "$items",
          },

          {
            $group: {

              _id:
                "$items.product",

              totalSold:
                {
                  $sum:
                    "$items.qty",
                },
            },
          },

          {
            $sort: {
              totalSold:
                -1,
            },
          },

          {
            $limit: 4,
          },

          {
            $lookup: {

              from:
                "products",

              localField:
                "_id",

              foreignField:
                "_id",

              as:
                "product",
            },
          },

          {
            $unwind:
              "$product",
          },

          {
            $replaceRoot:
              {
                newRoot:
                  "$product",
              },
          },
        ]);

      res.json(
        bestSellers
      );

    } catch (error) {

      console.error(
        "❌ getBestSellers:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching best sellers",
      });
    }
  };