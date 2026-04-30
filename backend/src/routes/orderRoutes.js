const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

/* ======================
   🟢 ORDERS
====================== */

// create order (manual fallback)
router.post("/", authMiddleware, orderController.createOrder);

// get user orders
router.get("/", authMiddleware, orderController.getMyOrders);


/* ======================
   💳 STRIPE
====================== */

// create stripe checkout session
router.post(
  "/checkout-session",
  authMiddleware,
  orderController.createCheckoutSession
);

module.exports = router;
router.post("/webhook", orderController.stripeWebhook);