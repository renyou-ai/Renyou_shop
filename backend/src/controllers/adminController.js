// backend/src/controllers/adminController.js

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

/* =========================
   🟢 GET DASHBOARD STATS
========================= */
exports.getStats = async (req, res) => {

  try {

    const now = new Date();

    const month =
      parseInt(req.query.month) ||
      now.getMonth() + 1;

    const year =
      parseInt(req.query.year) ||
      now.getFullYear();

    const start = new Date(
      year,
      month - 1,
      1
    );

    const end = new Date(
      year,
      month,
      0,
      23,
      59,
      59
    );

    const prevStart = new Date(
      year,
      month - 2,
      1
    );

    const prevEnd = new Date(
      year,
      month - 1,
      0,
      23,
      59,
      59
    );

    const [
      revenueThis,
      revenuePrev,

      ordersThis,
      ordersPrev,

      activeProducts,
      prevProducts,

      totalUsers,
      prevUsers,

    ] = await Promise.all([

      /* REVENUE THIS */
      Order.aggregate([
        {
          $match: {

            createdAt: {
              $gte: start,
              $lte: end,
            },

            orderStatus: {
              $ne: "cancelled",
            },
          },
        },

        {
          $group: {

            _id: null,

            total: {
              $sum: {
                $multiply: [
                  "$totalPrice",
                  0.4,
                ],
              },
            },
          },
        },
      ]),

      /* REVENUE PREVIOUS */
      Order.aggregate([
        {
          $match: {

            createdAt: {
              $gte: prevStart,
              $lte: prevEnd,
            },

            orderStatus: {
              $ne: "cancelled",
            },
          },
        },

        {
          $group: {

            _id: null,

            total: {
              $sum: {
                $multiply: [
                  "$totalPrice",
                  0.4,
                ],
              },
            },
          },
        },
      ]),

      /* ORDERS THIS */
      Order.countDocuments({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      }),

      /* ORDERS PREVIOUS */
      Order.countDocuments({
        createdAt: {
          $gte: prevStart,
          $lte: prevEnd,
        },
      }),

      /* PRODUCTS THIS */
      Product.countDocuments({

        isActive: true,

        createdAt: {
          $gte: start,
          $lte: end,
        },
      }),

      /* PRODUCTS PREVIOUS */
      Product.countDocuments({

        isActive: true,

        createdAt: {
          $gte: prevStart,
          $lte: prevEnd,
        },
      }),

      /* USERS THIS */
      User.countDocuments({

        role: "user",

        createdAt: {
          $gte: start,
          $lte: end,
        },
      }),

      /* USERS PREVIOUS */
      User.countDocuments({

        role: "user",

        createdAt: {
          $gte: prevStart,
          $lte: prevEnd,
        },
      }),

    ]);

    const totalRevenue =
      revenueThis[0]?.total || 0;

    const prevRevenue =
      revenuePrev[0]?.total || 0;

    const revenueChange =
      prevRevenue
        ? +(
            (
              (totalRevenue -
                prevRevenue) /
              prevRevenue
            ) * 100
          ).toFixed(1)
        : totalRevenue > 0
          ? 100
          : 0;

    const ordersChange =
      ordersPrev
        ? +(
            (
              (ordersThis -
                ordersPrev) /
              ordersPrev
            ) * 100
          ).toFixed(1)
        : ordersThis > 0
          ? 100
          : 0;

    const productsChange =
      prevProducts
        ? +(
            (
              (activeProducts -
                prevProducts) /
              prevProducts
            ) * 100
          ).toFixed(1)
        : activeProducts > 0
          ? 100
          : 0;

    const usersChange =
      prevUsers
        ? +(
            (
              (totalUsers -
                prevUsers) /
              prevUsers
            ) * 100
          ).toFixed(1)
        : totalUsers > 0
          ? 100
          : 0;

    res.json({

      revenue: {

        value:
          Math.round(
            totalRevenue
          ),

        change:
          revenueChange,
      },

      orders: {

        value:
          ordersThis,

        change:
          ordersChange,
      },

      products: {

        value:
          activeProducts,

        change:
          productsChange,
      },

      users: {

        value:
          totalUsers,

        change:
          usersChange,
      },
    });

  } catch (err) {

    console.error(
      "getStats:",
      err
    );

    res.status(500).json({
      message:
        "Server error",
    });
  }
};

/* =========================
   🟢 GET REVENUE TREND
========================= */
exports.getRevenueTrend = async (
  req,
  res
) => {

  try {

    const now = new Date();

    const month =
      parseInt(req.query.month) ||
      now.getMonth() + 1;

    const year =
      parseInt(req.query.year) ||
      now.getFullYear();

    const startDate =
      new Date(
        year,
        month - 1,
        1
      );

    const endDate =
      new Date(
        year,
        month,
        0,
        23,
        59,
        59
      );

    const daysInMonth =
      new Date(
        year,
        month,
        0
      ).getDate();

    const revenueData =
      await Order.aggregate([

        {
          $match: {

            createdAt: {
              $gte:
                startDate,
              $lte:
                endDate,
            },

            orderStatus: {
              $ne:
                "cancelled",
            },
          },
        },

        {
          $group: {

            _id: {
              day: {
                $dayOfMonth:
                  "$createdAt",
              },
            },

            revenue: {
              $sum: {
                $multiply: [
                  "$totalPrice",
                  0.4,
                ],
              },
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.day": 1,
          },
        },
      ]);

    const formatted = [];

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {

      const found =
        revenueData.find(
          (d) =>
            d._id.day === day
        );

      formatted.push({

        day,

        revenue:
          Number(
            (
              found?.revenue ||
              0
            ).toFixed(2)
          ),

        orders:
          found?.orders || 0,
      });
    }

    res.json(formatted);

  } catch (err) {

    console.error(
      "getRevenueTrend:",
      err
    );

    res.status(500).json({
      message:
        "Server error",
    });
  }
};

/* =========================
   🟢 SALES BY CATEGORY
========================= */
exports.getSalesByCategory =
  async (req, res) => {

    try {

      const now =
        new Date();

      const month =
        parseInt(
          req.query.month
        ) ||
        now.getMonth() + 1;

      const year =
        parseInt(
          req.query.year
        ) ||
        now.getFullYear();

      const start =
        new Date(
          year,
          month - 1,
          1
        );

      const end =
        new Date(
          year,
          month,
          0,
          23,
          59,
          59
        );

      const data =
        await Order.aggregate([

          {
            $match: {

              createdAt: {
                $gte:
                  start,
                $lte:
                  end,
              },

              orderStatus: {
                $ne:
                  "cancelled",
              },
            },
          },

          {
            $unwind:
              "$items",
          },

          {
            $lookup: {

              from:
                "products",

              localField:
                "items.product",

              foreignField:
                "_id",

              as:
                "productInfo",
            },
          },

          {
            $unwind: {

              path:
                "$productInfo",

              preserveNullAndEmptyArrays:
                true,
            },
          },

          /* 🔥 CATEGORY LOOKUP */
          {
            $lookup: {

              from:
                "categories",

              localField:
                "productInfo.category",

              foreignField:
                "_id",

              as:
                "categoryInfo",
            },
          },

          {
            $unwind: {

              path:
                "$categoryInfo",

              preserveNullAndEmptyArrays:
                true,
            },
          },

          {
            $group: {

              _id:
                "$categoryInfo.name",

              revenue: {
                $sum: {
                  $multiply: [
                    "$items.price",
                    "$items.qty",
                    0.4,
                  ],
                },
              },

              count: {
                $sum:
                  "$items.qty",
              },
            },
          },

          {
            $sort: {
              revenue:
                -1,
            },
          },

          {
            $project: {

              _id: 0,

              category: {
                $ifNull: [
                  "$_id",
                  "Other",
                ],
              },

              revenue: {
                $round: [
                  "$revenue",
                  2,
                ],
              },

              count: 1,
            },
          },
        ]);

      res.json(data);

    } catch (err) {

      console.error(
        "getSalesByCategory:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  };

/* =========================
   🟢 RECENT ORDERS
========================= */
exports.getRecentOrders =
  async (req, res) => {

    try {

      const limit =
        Number.parseInt(
          req.query.limit
        ) || 6;

      const month =
        parseInt(
          req.query.month
        );

      const year =
        parseInt(
          req.query.year
        );

      const query = {};

      if (
        month &&
        year
      ) {

        query.createdAt = {

          $gte:
            new Date(
              year,
              month - 1,
              1
            ),

          $lte:
            new Date(
              year,
              month,
              0,
              23,
              59,
              59
            ),
        };
      }

      const orders =
        await Order.find(
          query
        )

          .sort({
            createdAt: -1,
          })

          .limit(limit)

          .populate(
            "user",
            "name email"
          )

          .populate(
            "items.product",
            "name images price"
          )

          .lean();

      res.json(orders);

    } catch (err) {

      console.error(
        "getRecentOrders:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  };

/* =========================
   🟢 STOCK ALERTS
========================= */
exports.getStockAlerts =
  async (req, res) => {

    try {

      const threshold =
        parseInt(
          req.query.threshold
        ) || 15;

      const products =
        await Product.find({

          stock: {
            $lte:
              threshold,
          },

          isActive: true,
        })

          .sort({
            stock: 1,
          })

          .select(
            "name images stock category brand"
          )

          .lean();

      res.json(products);

    } catch (err) {

      console.error(
        "getStockAlerts:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  };

/* =========================
   🟢 GET ALL ORDERS
========================= */
exports.getAllOrders =
  async (req, res) => {

    try {

      const {
        status,
        page = 1,
        limit = 10,
      } = req.query;

      const query = {};

      if (status) {

        query.orderStatus =
          status;
      }

      /* =========================
         GET ORDERS
      ========================= */
      const [
        orders,
        total,
        pendingCount,
        processingCount,
        revenueResult,
      ] = await Promise.all([

        Order.find(query)

          .sort({
            createdAt: -1,
          })

          .skip(
            (page - 1) * limit
          )

          .limit(
            parseInt(limit)
          )

          .populate(
            "user",
            "name email"
          )

          .populate(
            "items.product",
            "name images"
          )

          .lean(),

        Order.countDocuments(
          query
        ),

        Order.countDocuments({
          orderStatus:
            "pending",
        }),

        Order.countDocuments({
          orderStatus:
            "processing",
        }),

        Order.aggregate([

          {
            $match: {

              createdAt: {
                $gte:
                  new Date(
                    new Date().setDate(
                      new Date().getDate() - 30
                    )
                  ),
              },

              orderStatus: {
                $ne:
                  "cancelled",
              },
            },
          },

          {
            $group: {

              _id: null,

              total: {
                $sum:
                  "$totalPrice",
              },
            },
          },
        ]),
      ]);

      const revenue30d =
        revenueResult[0]?.total || 0;

      res.json({

        orders,

        total,

        page:
          parseInt(page),

        pages:
          Math.ceil(
            total / limit
          ),

        stats: {

          totalOrders:
            total,

          pending:
            pendingCount,

          processing:
            processingCount,

          revenue30d:
            Math.round(
              revenue30d
            ),
        },
      });

    } catch (err) {

      console.error(
        "getAllOrders:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  };
/* =========================
   🟢 UPDATE ORDER STATUS
========================= */
exports.updateOrderStatus =
  async (req, res) => {

    try {

      const { status } =
        req.body;

      const valid = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (
        !valid.includes(
          status
        )
      ) {

        return res
          .status(400)
          .json({
            message:
              "Invalid status",
          });
      }

      const order =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            orderStatus:
              status,
          },

          {
            new: true,
            runValidators: true,
          }
        )

          .populate(
            "user",
            "name email"
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

    } catch (err) {

      console.error(
        "updateOrderStatus:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  };
  