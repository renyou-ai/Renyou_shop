import axiosInstance
  from "./axiosInstance";

/* =========================
   GET CATEGORIES
========================= */
export const getCategories = async () => {
  try {

    const { data } = await axiosInstance.get(
      "/categories"
    );

    return data;

  } catch (error) {

    console.error(
      "❌ getCategories error:",
      error.response?.data || error.message
    );

    throw error;
  }
};
/* =========================
   CREATE CATEGORY
========================= */
export const createCategory = async (payload) => {
  try {

    const { data } = await axiosInstance.post(
      "/categories",
      payload
    );

    return data;

  } catch (error) {

    console.error(
      "❌ createCategory error:",
      error.response?.data || error.message
    );

    throw error;
  }
};
/* ======================
   DELETE CATEGORY
====================== */
export const deleteCategory = async (id) => {
  try {

    const { data } = await axiosInstance.delete(
      `/categories/${id}`
    );

    return data;

  } catch (error) {

    console.error(
      "❌ deleteCategory error:",
      error.response?.data || error.message
    );

    throw error;
  }
};