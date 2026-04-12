import axiosInstance from "./axiosInstance";

// GET ALL
export const getProducts = async (filters = {}) => {
  const { data } = await axiosInstance.get("/products", {
    params: filters,
  });
  return data;
};

// GET ONE
export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};

// CREATE (utile Postman / admin plus tard)
export const createProduct = async (payload) => {
  const { data } = await axiosInstance.post("/products", payload);
  return data;
};

// UPDATE
export const updateProduct = async (id, payload) => {
  const { data } = await axiosInstance.put(`/products/${id}`, payload);
  return data;
};

// DELETE
export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};