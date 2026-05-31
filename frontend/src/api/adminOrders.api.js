import axiosInstance from "./axiosInstance";

/* =========================
   GET ALL ORDERS
========================= */
export const getAllOrders = async (
  params = {}
) => {

  const { data } =
    await axiosInstance.get(
      "/admin/all-orders",
      {
        params,
      }
    );

  return data;
};

/* =========================
   UPDATE ORDER STATUS
========================= */
export const updateOrderStatus = async (
  id,
  status
) => {

  const { data } =
    await axiosInstance.patch(
      `/admin/orders/${id}/status`,
      {
        status,
      }
    );

  return data;
};