const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/skin-profile",authMiddleware,authController.updateSkinProfile);
router.put(
  "/shipping-address",
  authMiddleware,
  authController.updateShippingAddress
);
module.exports = router;