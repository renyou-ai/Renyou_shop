import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const {
    cart,
    addToCart,
    removeFromCart,
    decreaseQty,
    loading,
  } = useCart();

  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) =>
      acc + item.price * item.qty,
    0
  );

  return (

    <div className="px-6 md:px-10 py-10 bg-[#F7F5FF] min-h-screen">

      <h1 className="text-3xl font-semibold mb-8 text-[#0B2545]">
        Your Cart
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">
          Loading...
        </p>
      )}

      {/* EMPTY */}
      {!loading && cart.length === 0 && (

        <div className="text-center text-gray-500 mt-20">

          <p>Your cart is empty</p>

          <button
            onClick={() =>
              navigate("/shop")
            }
            className="mt-4 text-orange-500 underline"
          >
            Go shopping
          </button>

        </div>
      )}

      {/* CART */}
      {!loading && cart.length > 0 && (

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">

            {cart.map((item) => (

              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm"
              >

                {/* PRODUCT */}
                <div className="flex items-center gap-4">

                  <img
                    src={
                      item.image ||
                      item.images?.[0] ||
                      "/images/placeholder.png"
                    }
                    alt={item.name}
                    className="h-20 w-20 object-contain rounded-xl bg-gray-50"
                  />

                  <div>

                    <h3 className="font-medium text-[#1e1e2f]">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      $
                      {Number(
                        item.price || 0
                      ).toFixed(2)}
                    </p>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">

                  <button
                    onClick={() =>
                      decreaseQty(
                        item._id,
                        item.qty
                      )
                    }
                    className="px-2 py-1 border rounded-lg hover:bg-gray-100 transition"
                  >
                    -
                  </button>

                  <span className="min-w-[20px] text-center font-medium">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      addToCart(item)
                    }
                    className="px-2 py-1 border rounded-lg hover:bg-gray-100 transition"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item._id
                      )
                    }
                    className="text-red-500 text-sm hover:underline ml-2"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-8">

            <h2 className="text-xl font-semibold mb-6 text-[#0B2545]">
              Summary
            </h2>

            <div className="flex justify-between mb-4 text-sm">

              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-semibold">
                ${totalPrice.toFixed(2)}
              </span>

            </div>

            <div className="flex justify-between mb-6 text-sm">

              <span className="text-gray-500">
                Shipping
              </span>

              <span className="font-semibold">
                Free
              </span>

            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-bold text-[#0B2545]">

              <span>Total</span>

              <span>
                ${totalPrice.toFixed(2)}
              </span>

            </div>

            {/* 🔥 NEW FLOW */}
            <button
              onClick={() =>
                navigate("/checkout")
              }
              disabled={cart.length === 0}
              className="w-full mt-6 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl transition disabled:opacity-50 font-medium"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() =>
                navigate("/shop")
              }
              className="w-full mt-3 text-sm text-gray-500 underline"
            >
              Continue Shopping
            </button>

          </div>

        </div>
      )}

    </div>
  );
}