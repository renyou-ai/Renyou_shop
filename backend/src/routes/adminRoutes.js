// backend/src/routes/adminRoutes.js

const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

const ctrl = require("../controllers/adminController");

/* 🔥 ADMIN ONLY */
router.use(
  authMiddleware,
  isAdmin
);

/* =========================
   🟢 DASHBOARD
========================= */
router.get(
  "/stats",
  ctrl.getStats
);

router.get(
  "/revenue-trend",
  ctrl.getRevenueTrend
);

router.get(
  "/sales-by-category",
  ctrl.getSalesByCategory
);

/* =========================
   🟢 ORDERS
========================= */
router.get(
  "/recent-orders",
  ctrl.getRecentOrders
);

router.get(
  "/all-orders",
  ctrl.getAllOrders
);

router.patch(
  "/orders/:id/status",
  ctrl.updateOrderStatus
);

/* =========================
   🟢 STOCK
========================= */
router.get(
  "/stock-alerts",
  ctrl.getStockAlerts
);

module.exports = router;