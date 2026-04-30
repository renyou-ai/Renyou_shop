import { useCart } from "@/context/CartContext";
import { createCheckoutSession } from "@/api/order.api";

export default function Checkout() {
  const { cart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleCheckout = async () => {
    try {
      const res = await createCheckoutSession();

      if (!res?.url) {
        console.error("❌ No URL returned from backend:", res);
        alert("Stripe session error");
        return;
      }

      // 🔥 REDIRECT TO STRIPE
      window.location.href = res.url;

    } catch (err) {
      console.error("❌ Checkout error:", err.response?.data || err.message);
      alert("Payment failed");
    }
  };

  return (
    <div className="px-10 py-10">

      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      {/* PRODUCTS */}
      <div className="mb-8 space-y-4">
        {cart.map((item) => (
          <div key={item._id} className="flex justify-between">
            <span>{item.name} x {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="flex justify-between text-xl font-semibold mb-6">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleCheckout}
        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:opacity-90 transition"
      >
        Pay with Card
      </button>

    </div>
  );
}