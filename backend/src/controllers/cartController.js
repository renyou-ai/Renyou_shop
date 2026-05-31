const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* ======================
   🟢 GET CART (AUTO CLEAN)
====================== */
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId })
      .populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    // 🔥 CLEAN AUTOMATIQUE
    cart.items = cart.items.filter(item => {
      if (!item.product) return false; // produit supprimé
      if (item.product.stock <= 0) return false; // stock 0

      // corriger qty si dépasse stock
      if (item.qty > item.product.stock) {
        item.qty = item.product.stock;
      }

      return true;
    });

    await cart.save();

    res.json(cart);

  } catch (error) {
    console.error("❌ getCart error:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

/* ======================
   🟢 ADD TO CART (SAFE)
====================== */
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    // 🔥 vérification produit
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // 🔥 éviter dépasser stock
      if (cart.items[itemIndex].qty < product.stock) {
        cart.items[itemIndex].qty += 1;
      }
    } else {
      cart.items.push({ product: productId, qty: 1 });
    }

    await cart.save();

    const updatedCart = await cart.populate("items.product");

    res.json(updatedCart);

  } catch (error) {
    console.error("❌ addToCart error:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

/* ======================
   🟢 UPDATE QTY (SAFE)
====================== */
exports.updateQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId })
      .populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product?._id.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔥 sécurité qty
    if (qty <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product._id.toString() !== productId
      );
    } else {
      item.qty = Math.min(qty, item.product.stock);
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    console.error("❌ updateQty error:", error);
    res.status(500).json({ message: "Error updating cart" });
  }
};

/* ======================
   🟢 REMOVE ITEM
====================== */
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await cart.populate("items.product");

    res.json(updatedCart);

  } catch (error) {
    console.error("❌ removeFromCart error:", error);
    res.status(500).json({ message: "Error removing item" });
  }
};