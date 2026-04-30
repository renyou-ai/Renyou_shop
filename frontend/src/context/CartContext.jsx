/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  getCart,
  addToCart as addToCartAPI,
  updateQty,
  removeFromCart as removeFromCartAPI,
} from "@/api/cart.api";

import { useAuth } from "@/context/AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD CART FROM BACKEND
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();

      const formatted = res.data.items.map((item) => ({
        ...item.product,
        qty: item.qty,
      }));

      setCart(formatted);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // load au login
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [token]);

  // 🟢 ADD
  const addToCart = async (product) => {
    try {
      await addToCartAPI(product._id);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔴 REMOVE
  const removeFromCart = async (id) => {
    try {
      await removeFromCartAPI(id);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔽 DECREASE
  const decreaseQty = async (id, currentQty) => {
    try {
      if (currentQty <= 1) {
        await removeFromCartAPI(id);
      } else {
        await updateQty(id, currentQty - 1);
      }
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🧹 CLEAR CART (🔥 IMPORTANT POUR STRIPE SUCCESS)
  const clearCart = () => {
    setCart([]); // frontend instant
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        decreaseQty,
        clearCart, // ✅ AJOUT IMPORTANT
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCart() {
  return useContext(CartContext);
}