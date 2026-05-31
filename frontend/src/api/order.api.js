import axiosInstance from "./axiosInstance";

/* ======================
   💳 STRIPE CHECKOUT
====================== */
export const createCheckoutSession =
  async () => {

    const { data } =
      await axiosInstance.post(
        "/orders/checkout-session"
      );

    return data;
  };

/* ======================
   📦 GET USER ORDERS
====================== */
export const getMyOrders =
  async () => {

    const { data } =
      await axiosInstance.get(
        "/orders"
      );

    return data;
  };

/* ======================
   🚚 SAVE ADDRESS
====================== */
export const saveShippingAddress =
  async (addressData) => {

    const { data } =
      await axiosInstance.put(
        "/auth/shipping-address",
        addressData
      );

    return data;
  };
  /* ======================
   💵 CASH ORDER
====================== */
export const createCashOrder =
  async () => {

    const { data } =
      await axiosInstance.post(
        "/orders/cash"
      );

    return data;
  };