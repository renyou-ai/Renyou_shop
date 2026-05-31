import axiosInstance
  from "./axiosInstance";

/* =========================
   GET USERS
========================= */
export const getUsers =
  async () => {

    try {

      const { data } =
        await axiosInstance.get(
          "/admin/users"
        );

      return data;

    } catch (error) {

      console.error(
        "❌ getUsers:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };

/* =========================
   CREATE USER
========================= */
export const createUser =
  async (payload) => {

    try {

      const { data } =
        await axiosInstance.post(
          "/admin/users",
          payload
        );

      return data;

    } catch (error) {

      console.error(
        "❌ createUser:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };

/* =========================
   DELETE USER
========================= */
export const deleteUser =
  async (id) => {

    try {

      const { data } =
        await axiosInstance.delete(
          `/admin/users/${id}`
        );

      return data;

    } catch (error) {

      console.error(
        "❌ deleteUser:",
        error.response?.data ||
        error.message
      );

      throw error;
    }
  };
  /* ========================================
   USERS STATS
======================================== */
export const getUsersStats = async () => {

  const { data } =
    await axiosInstance.get(
      "/admin/users/stats"
    );

  return data;
};