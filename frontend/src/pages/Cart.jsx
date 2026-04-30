import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "@/api/order.api";

export default function Cart() {
  const { cart, addToCart, removeFromCart, decreaseQty, loading } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleCheckout = async () => {
    try {
      const res = await createCheckoutSession();

      if (!res?.url) {
        console.error("❌ No URL from backend:", res);
        alert("Stripe error");
        return;
      }

      // ✅ FIX ICI
      window.location.href = res.url;

    } catch (err) {
      console.error("❌ Checkout error:", err.response?.data || err.message);
      alert("Something went wrong with checkout");
    }
  };

  return (
    <div className="px-6 md:px-10 py-10">

      <h1 className="text-3xl font-semibold mb-8 text-[#0B2545]">
        Your Cart
      </h1>

      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {!loading && cart.length === 0 && (
        <div className="text-center text-gray-500">
          <p>Your cart is empty</p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-4 text-orange-500 underline"
          >
            Go shopping
          </button>
        </div>
      )}

      {!loading && cart.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8">

          <div className="md:col-span-2 space-y-4">

            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
              >

                <div className="flex items-center gap-4">

                  <img
                    src={
                      item.image
                        ? item.image.startsWith("/images")
                          ? item.image
                          : `http://localhost:5000${item.image}`
                        : "/images/placeholder.png"
                    }
                    alt={item.name}
                    className="h-20 w-20 object-contain"
                  />

                  <div>
                    <h3 className="font-medium text-[#1e1e2f]">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      ${Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <button
                    onClick={() => decreaseQty(item._id, item.qty)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>

                  <span className="min-w-[20px] text-center">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          <div className="bg-white p-6 rounded-xl shadow h-fit">

            <h2 className="text-xl font-semibold mb-4 text-[#0B2545]">
              Summary
            </h2>

            <div className="flex justify-between mb-2">
              <span>Total</span>
              <span className="font-semibold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full mt-4 bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg transition disabled:opacity-50"
            >
              Checkout
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="w-full mt-2 text-sm text-gray-500 underline"
            >
              Continue Shopping
            </button>

          </div>

        </div>
      )}

    </div>
  );
}