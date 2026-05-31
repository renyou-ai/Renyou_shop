const User =
  require("../models/User");

const Order =
  require("../models/Order");

const bcrypt =
  require("bcrypt");

/* =========================
   GET USERS
========================= */
exports.getUsers =
  async (req, res) => {

    try {

      console.log(
        "✅ GET USERS HIT"
      );

      const users =
        await User.find({
          role: "user",
        })
        .sort({
          createdAt: -1,
        })
        .lean();

      const usersWithStats =
        await Promise.all(

          users.map(
            async (user) => {

              const orders =
                await Order.find({
                  user: user._id,
                }).lean();

              const ordersCount =
                orders.length;

              const totalSpent =
                orders.reduce(
                  (sum, order) =>
                    sum +
                    (order.totalPrice || 0),
                  0
                );

              const sortedOrders =
                orders.sort(
                  (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );

              return {

                ...user,

                ordersCount,

                totalSpent,

                lastOrder:
                  sortedOrders[0]
                    ?.createdAt || null,
              };
            }
          )
        );

      res.status(200).json(
        usersWithStats
      );

    } catch (error) {

      console.error(
        "❌ getUsers:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch users",
      });
    }
  };

/* =========================
   CREATE USER
========================= */
exports.createUser =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {

        return res
          .status(400)
          .json({
            message:
              "All fields required",
          });
      }

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res
          .status(400)
          .json({
            message:
              "User already exists",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({

          name,

          email,

          password:
            hashedPassword,

          role: "user",
        });

      res.status(201).json(
        user
      );

    } catch (error) {

      console.error(
        "❌ createUser:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create user",
      });
    }
  };

/* =========================
   DELETE USER
========================= */
exports.deleteUser =
  async (req, res) => {

    try {

      const deleted =
        await User.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      res.status(200).json({
        message:
          "User deleted successfully",
      });

    } catch (error) {

      console.error(
        "❌ deleteUser:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete user",
      });
    }
    
  };
  exports.getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password")
      .lean();

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }

    const orders = await Order.find({
      user: user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalSpent = orders.reduce(
      (sum, order) =>
        sum + (order.totalPrice || 0),
      0
    );

    res.json({
      ...user,
      orders,
      totalSpent,
      ordersCount: orders.length,
    });

  } catch (error) {

    console.error(
      "getUserById:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};
exports.getUserById = async (req, res) => {

  try {

    const user =
      await User.findById(req.params.id)
        .select("-password")
        .lean();

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }

    const orders =
      await Order.find({
        user: user._id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    const totalSpent =
      orders.reduce(
        (sum, order) =>
          sum + (order.totalPrice || 0),
        0
      );

    res.json({

      ...user,

      orders,

      totalSpent,

      ordersCount:
        orders.length,
    });

  } catch (error) {

    console.error(
      "getUserById:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};
exports.getUsersStats = async (req, res) => {

  try {

    const users =
      await User.find({
        role: "user",
      }).lean();

    const totalCustomers =
      users.length;

    /* ACTIVE TODAY */
    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const activeToday =
      users.filter((u) => {

        return (
          u.updatedAt &&
          new Date(u.updatedAt) >= today
        );
      }).length;

    /* ORDERS */
    const orders =
      await Order.find().lean();

    const totalSpent =
      orders.reduce(
        (sum, order) =>
          sum + (order.totalPrice || 0),
        0
      );

    const averageSpent =
      totalCustomers > 0
        ? totalSpent / totalCustomers
        : 0;

    /* LOYAL USERS */
    const loyalUsers =
      users.filter((u) => {

        const userOrders =
          orders.filter(
            (o) =>
              o.user?.toString() ===
              u._id.toString()
          );

        return userOrders.length >= 3;
      }).length;

    const loyaltyRate =
      totalCustomers > 0
        ? Math.round(
            (loyalUsers /
              totalCustomers) *
              100
          )
        : 0;

    res.json({

      totalCustomers,

      activeToday,

      averageSpent,

      loyaltyRate,
    });

  } catch (error) {

    console.error(
      "getUsersStats:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch stats",
    });
  }
};