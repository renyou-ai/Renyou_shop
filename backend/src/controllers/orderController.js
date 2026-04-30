exports.stripeWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.metadata.userId;

      const cart = await Cart.findOne({ user: userId }).populate("items.product");

      if (!cart) return;

      const totalPrice = cart.items.reduce(
        (acc, item) => acc + item.product.price * item.qty,
        0
      );

      const order = await Order.create({
        user: userId,
        items: cart.items,
        totalPrice,
        status: "paid",
      });

      // 🧹 vider panier
      cart.items = [];
      await cart.save();

      console.log("✅ Order created:", order._id);

    } catch (err) {
      console.error("❌ Webhook error:", err);
    }
  }

  res.json({ received: true });
};