import axiosInstance from "./axiosInstance";

/* ======================
   💳 STRIPE CHECKOUT
====================== */
export const createCheckoutSession = async () => {
  const { data } = await axiosInstance.post("/orders/checkout-session");
  return data; // ✅ IMPORTANT
};

/* ======================
   📦 GET USER ORDERS
====================== */
export const getMyOrders = async () => {
  const { data } = await axiosInstance.get("/orders");
  return data;
};