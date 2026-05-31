
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import axios from "axios";

const BASE =
  "http://localhost:5000/api/admin";

export function useAdminStats(
  month,
  year
) {

  const [stats, setStats] =
    useState(null);

  const [trend, setTrend] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [stockAlerts, setStockAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState(null);

  const token =
    localStorage.getItem(
      "token"
    );

  const cfg = useMemo(
    () => ({
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }),
    [token]
  );

  const fetchAll =
    useCallback(
      async (
        showLoader = true
      ) => {

        try {

          if (showLoader) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }

          setError(null);

          const requests = [

            axios
              .get(
                `${BASE}/stats`,
                cfg
              )
              .catch(() => ({
                data: null,
              })),

            axios
              .get(
                `${BASE}/revenue-trend?month=${month}&year=${year}`,
                cfg
              )
              .catch(() => ({
                data: [],
              })),

            axios
              .get(
                `${BASE}/sales-by-category`,
                cfg
              )
              .catch(() => ({
                data: [],
              })),

            axios
              .get(
                `${BASE}/recent-orders?limit=6`,
                cfg
              )
              .catch(() => ({
                data: [],
              })),

            axios
              .get(
                `${BASE}/stock-alerts?threshold=15`,
                cfg
              )
              .catch(() => ({
                data: [],
              })),
          ];

          const [
            s,
            t,
            c,
            o,
            a,
          ] =
            await Promise.all(
              requests
            );

          setStats(s.data);

          setTrend(
            Array.isArray(
              t.data
            )
              ? t.data
              : []
          );

          setCategories(
            Array.isArray(
              c.data
            )
              ? c.data
              : []
          );

          setOrders(
            Array.isArray(
              o.data
            )
              ? o.data
              : o.data
                  ?.orders || []
          );

          setStockAlerts(
            Array.isArray(
              a.data
            )
              ? a.data
              : []
          );

        } catch (err) {

          console.error(err);

          setError(
            err.response?.data
              ?.message ||
              "Failed to load dashboard"
          );

        } finally {

          setLoading(false);

          setRefreshing(false);
        }
      },
      [
        month,
        year,
        cfg,
      ]
    );

  /* FIRST LOAD */
  useEffect(() => {

    fetchAll();

  }, [fetchAll]);

  /* AUTO REFRESH */
  useEffect(() => {

    const interval =
      setInterval(() => {

        fetchAll(false);

      }, 30000);

    return () =>
      clearInterval(
        interval
      );

  }, [fetchAll]);

  /* EXTRA ANALYTICS */
  const analytics =
    useMemo(() => {

      const totalRevenue =
        orders.reduce(
          (acc, order) =>
            acc +
            (order.totalPrice ||
              0),
          0
        );

      const averageOrderValue =
        orders.length > 0
          ? totalRevenue /
            orders.length
          : 0;

      const pendingOrders =
        orders.filter(
          (o) =>
            (o.orderStatus ||
              o.status) ===
            "pending"
        ).length;

      const lowStockProducts =
        stockAlerts.filter(
          (p) =>
            p.stock <= 5
        ).length;

      return {

        totalRevenue,

        averageOrderValue,

        pendingOrders,

        lowStockProducts,
      };

    }, [
      orders,
      stockAlerts,
    ]);

  return {

    stats,

    trend,

    categories,

    orders,

    stockAlerts,

    analytics,

    loading,

    refreshing,

    error,

    refetch: fetchAll,
  };
}
