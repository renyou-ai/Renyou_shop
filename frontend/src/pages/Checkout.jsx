import { useState } from "react";

import { useCart } from "@/context/CartContext";

import {
  createCheckoutSession,
  createCashOrder,
  saveShippingAddress,
} from "@/api/order.api";

import { useNavigate } from "react-router-dom";

export default function Checkout() {

  const {
    cart = [],
    loading,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState("online");

  const [paying, setPaying] =
    useState(false);

  const [form, setForm] = useState({

    fullName: "",

    phone: "",

    address: "",

    city: "",

    postalCode: "",

    country: "",
  });

  const total = cart.reduce(
    (acc, item) => {

      const price =
        item.product?.price ||
        item.price ||
        0;

      return (
        acc + price * item.qty
      );
    },
    0
  );

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  const isFormValid = () => {

    return (
      form.fullName &&
      form.phone &&
      form.address &&
      form.city &&
      form.postalCode &&
      form.country
    );
  };

  const handlePlaceOrder = async () => {

    if (!isFormValid()) {

      alert(
        "Please fill all shipping fields"
      );

      return;
    }

    setPaying(true);

    try {

      // SAVE ADDRESS
      await saveShippingAddress(
        form
      );

      // ONLINE
      if (
        paymentMethod ===
        "online"
      ) {

        const res =
          await createCheckoutSession();

        if (!res?.url) {

          alert("Stripe error");

          return;
        }

        window.location.href =
          res.url;

        return;
      }

      // CASH ORDER
      await createCashOrder();

      // 🔥 IMPORTANT
      await clearCart();

      navigate("/success");

    } catch (err) {

      console.error(
        "❌ checkout:",
        err
      );

      alert(
        "Something went wrong"
      );

    } finally {

      setPaying(false);
    }
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <p className="text-gray-400 animate-pulse">
          Loading checkout...
        </p>

      </div>
    );
  }

  if (cart.length === 0) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">

        <p className="text-gray-500 text-lg">
          Your cart is empty 🛒
        </p>

        <button
          onClick={() =>
            navigate("/shop")
          }
          className="bg-orange-500 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#F7F5FF] py-10 px-6">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_420px] gap-8">

        {/* LEFT */}
        <div className="bg-white rounded-3xl shadow-sm p-8">

          <h1 className="text-3xl font-semibold text-[#0B2545] mb-8">
            Checkout
          </h1>

          <div className="mb-10">

            <h2 className="text-lg font-semibold text-[#0B2545] mb-5">
              Shipping Address
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                name="address"
                placeholder="Street Address"
                value={form.address}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none md:col-span-2"
              />

              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                name="postalCode"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none md:col-span-2"
              />

            </div>

          </div>

          <div>

            <h2 className="text-lg font-semibold text-[#0B2545] mb-5">
              Payment Method
            </h2>

            <div className="space-y-4">

              <button
                onClick={() =>
                  setPaymentMethod(
                    "online"
                  )
                }
                className={`w-full border rounded-2xl p-5 text-left transition ${
                  paymentMethod ===
                  "online"
                    ? "border-[#3D2C8D] bg-[#f6f3ff]"
                    : "border-gray-200"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-semibold text-[#0B2545]">
                      Pay Online
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Secure payment with Stripe
                    </p>

                  </div>

                  <span className="text-xl">
                    💳
                  </span>

                </div>

              </button>

              <button
                onClick={() =>
                  setPaymentMethod(
                    "cash"
                  )
                }
                className={`w-full border rounded-2xl p-5 text-left transition ${
                  paymentMethod ===
                  "cash"
                    ? "border-[#3D2C8D] bg-[#f6f3ff]"
                    : "border-gray-200"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-semibold text-[#0B2545]">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Pay when your order arrives
                    </p>

                  </div>

                  <span className="text-xl">
                    💵
                  </span>

                </div>

              </button>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl shadow-sm p-8 h-fit sticky top-8">

          <h2 className="text-2xl font-semibold text-[#0B2545] mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">

            {cart.map((item) => {

              const price =
                item.product?.price ||
                item.price ||
                0;

              return (

                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-3"
                >

                  <div>

                    <p className="font-medium text-sm">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      Qty: {item.qty}
                    </p>

                  </div>

                  <span className="font-semibold text-sm">
                    $
                    {(
                      price *
                      item.qty
                    ).toFixed(2)}
                  </span>

                </div>
              );
            })}

          </div>

          <div className="flex justify-between text-xl font-bold text-[#0B2545] mb-8">

            <span>Total</span>

            <span>
              ${total.toFixed(2)}
            </span>

          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={paying}
            className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-2xl font-medium"
          >

            {paying
              ? "Processing..."
              : paymentMethod ===
                "online"
              ? "Continue to Payment"
              : "Place Order"}

          </button>

        </div>

      </div>

    </div>
  );
}