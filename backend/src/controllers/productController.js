const Product = require("../models/Product");

const getProducts = async (req, res) => {

  try {

    const products = await Product.find(req.query);

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: "Error fetching products" });

  }

};

const getProductById = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    res.json(product);

  } catch (error) {

    res.status(500).json({ message: "Error fetching product" });

  }

};

const createProduct = async (req, res) => {

  try {

    const product = new Product(req.body);

    await product.save();

    res.status(201).json(product);

  } catch (error) {

    res.status(500).json({ message: "Error creating product" });

  }

};

module.exports = {
  getProducts,
  getProductById,
  createProduct
};