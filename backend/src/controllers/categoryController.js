const Category =
  require("../models/Category");

/* =========================
   GET CATEGORIES
========================= */
exports.getCategories = async (req, res) => {
  try {

    const categories = await Category.find()
      .sort({ name: 1 });

    res.json(categories);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

/* =========================
   CREATE CATEGORY
========================= */
exports.createCategory = async (req, res) => {
  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name required",
      });
    }

    const exists = await Category.findOne({
      name: name.trim(),
    });
 if (exists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
    });

    res.status(201).json(category);

  } catch (err) {

    res.status(500).json({
      message: "Failed to create category",
    });
  }
};
  /* ======================
   DELETE
====================== */
exports.deleteCategory = async (req, res) => {
  try {

    const Product = require("../models/Product");

const productsUsingCategory =
  await Product.findOne({
    category: req.params.id,
  });

if (productsUsingCategory) {

  return res.status(400).json({
    message:
      "Cannot delete category used by products",
  });
}

await Category.findByIdAndDelete(
  req.params.id
);

    res.json({
      message: "Category deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: "Failed to delete category",
    });
  }
};