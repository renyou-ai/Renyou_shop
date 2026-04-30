const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, cartController.getCart);
router.post("/", authMiddleware, cartController.addToCart);
router.put("/", authMiddleware, cartController.updateQty);
router.delete("/:productId", authMiddleware, cartController.removeFromCart);

module.exports = router;