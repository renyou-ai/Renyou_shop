import axiosInstance from "./axiosInstance";

/* ======================
   🟢 GET ALL PRODUCTS
====================== */
export const getProducts = async (filters = {}) => {
  try {
    const { data } = await axiosInstance.get("/products", {
      params: filters,
    });
    return data;
  } catch (error) {
    console.error("❌ getProducts error:", error.response?.data || error.message);
    throw error;
  }
};

/* ======================
   🟢 GET ONE PRODUCT
====================== */
export const getProductById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.error("❌ getProductById error:", error.response?.data || error.message);
    return null; // important pour éviter crash UI
  }
};

/* ======================
   🟡 CREATE PRODUCT
====================== */
export const createProduct = async (payload) => {
  try {
    const { data } = await axiosInstance.post("/products", payload);
    return data;
  } catch (error) {
    console.error("❌ createProduct error:", error.response?.data || error.message);
    throw error;
  }
};

/* ======================
   🟠 UPDATE PRODUCT
====================== */
export const updateProduct = async (id, payload) => {
  try {
    const { data } = await axiosInstance.put(`/products/${id}`, payload);
    return data;
  } catch (error) {
    console.error("❌ updateProduct error:", error.response?.data || error.message);
    throw error;
  }
};

/* ======================
   🔴 DELETE PRODUCT
====================== */
export const deleteProduct = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/products/${id}`);
    return data;
  } catch (error) {
    console.error("❌ deleteProduct error:", error.response?.data || error.message);
    throw error;
  }
};