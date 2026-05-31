const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const { getBestSellers } = require("../controllers/orderController");
/* ======================
   🟢 ORDERS
====================== */
router.get("/bestsellers", getBestSellers);
router.post(
  "/cash",
  authMiddleware,
  orderController.createCashOrder
);
router.get("/", authMiddleware, orderController.getMyOrders);
router.get("/session", authMiddleware, orderController.getOrderBySession);
/* ======================
   💳 STRIPE
====================== */

router.post("/checkout-session", authMiddleware, orderController.createCheckoutSession);
router.post("/webhook", orderController.stripeWebhook);

/* ======================
   EXPORT
====================== */

module.exports = router;