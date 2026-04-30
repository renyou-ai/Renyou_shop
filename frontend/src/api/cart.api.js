import api from "./axiosInstance";

export const getCart = () => api.get("/cart");
export const addToCart = (productId) =>
  api.post("/cart", { productId });

export const updateQty = (productId, qty) =>
  api.put("/cart", { productId, qty });

export const removeFromCart = (productId) =>
  api.delete(`/cart/${productId}`);