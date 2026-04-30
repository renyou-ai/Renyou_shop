const Cart = require("../models/Cart");

// 🟢 GET USER CART
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// 🟢 ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].qty += 1;
    } else {
      cart.items.push({ product: productId, qty: 1 });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// 🟢 UPDATE QTY
exports.updateQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (item) {
      item.qty = qty;
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart" });
  }
};

// 🟢 REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing item" });
  }
};