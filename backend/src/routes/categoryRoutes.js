const express = require("express");

const router = express.Router();

const categoryController = require(
  "../controllers/categoryController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const isAdmin = require(
  "../middleware/isAdmin"
);

/* ======================
   PUBLIC
====================== */
router.get(
  "/",
  categoryController.getCategories
);

/* ======================
   ADMIN CREATE
====================== */
router.post(
  "/",
  authMiddleware,
  isAdmin,
  categoryController.createCategory
);

/* ======================
   ADMIN DELETE
====================== */
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;