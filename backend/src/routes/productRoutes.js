const express = require("express");

const router =
  express.Router();

const productController =
  require("../controllers/productController");

const authMiddleware =
  require("../middleware/authMiddleware");

const isAdmin =
  require("../middleware/isAdmin");

const upload =
  require("../middleware/upload");

/* ======================
   PUBLIC
====================== */

router.get(
  "/",
  productController.getProducts
);

router.get(
  "/bestsellers",
  productController.getBestSellers
);

/* ======================
   ADMIN
====================== */

router.post(
  "/upload",

  authMiddleware,

  isAdmin,

  upload.single("image"),

  (req, res) => {

    try {

      res.json({
        url:
          req.file.path,
      });

    } catch {

      res.status(500).json({
        message:
          "Upload failed",
      });
    }
  }
);

router.post(
  "/",
  authMiddleware,
  isAdmin,
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  productController.deleteProduct
);

/* ======================
   PUBLIC SINGLE
====================== */

router.get(
  "/:id",
  productController.getProductById
);

module.exports =
  router;