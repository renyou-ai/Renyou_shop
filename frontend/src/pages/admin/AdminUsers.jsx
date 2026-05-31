// ================================
// FILE: src/pages/admin/AdminUsers.jsx
// ================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  Activity,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

import UsersTable from "@/components/admin/UsersTable";
import AddUserModal from "@/components/admin/AddUserModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import KpiCard from "@/components/admin/KpiCard";

import {
  getUsers,
  createUser,
  deleteUser,
} from "@/api/adminUsers.api";

export default function AdminUsers() {

  const [collapsed, setCollapsed] =
    useState(false);

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showAdd, setShowAdd] =
    useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const USERS_PER_PAGE = 8;

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = async () => {

    try {

      setLoading(true);

      const data =
        await getUsers();

      setUsers(data || []);

    } catch (err) {

      console.error(
        "fetchUsers:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchUsers();

  }, []);

  /* =========================
     CREATE USER
  ========================= */
  const handleCreateUser =
    async (payload) => {

      await createUser(
        payload
      );

      fetchUsers();
    };

  /* =========================
     DELETE USER
  ========================= */
  const handleDeleteUser =
    async () => {

      try {

        setDeleteLoading(true);

        await deleteUser(
          deleteTarget._id
        );

        setDeleteTarget(null);

        fetchUsers();

      } finally {

        setDeleteLoading(false);
      }
    };

  /* =========================
     SEARCH
  ========================= */
  const filteredUsers =
    useMemo(() => {

      let data = [...users];

      if (search) {

        data = data.filter((u) => {

          const q =
            search.toLowerCase();

          return (

            u.name
              ?.toLowerCase()
              .includes(q)

            ||

            u.email
              ?.toLowerCase()
              .includes(q)
          );
        });
      }

      return data;

    }, [users, search]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages =
    Math.ceil(

      filteredUsers.length /

      USERS_PER_PAGE
    );

  const paginatedUsers =
    filteredUsers.slice(

      (currentPage - 1)

      *

      USERS_PER_PAGE,

      currentPage *

      USERS_PER_PAGE
    );

  /* =========================
     REAL KPIS
  ========================= */
  const totalUsers =
    users.length;

  const activeToday =
    users.filter((u) => {

      const today =
        new Date()
          .toDateString();

      const joinedToday =

        new Date(
          u.createdAt
        ).toDateString()

        ===

        today;

      const orderedToday =

        u.lastOrder &&

        new Date(
          u.lastOrder
        ).toDateString()

        ===

        today;

      return (
        joinedToday ||
        orderedToday
      );

    }).length;

  /* =========================
     EXPORT CSV
  ========================= */
  const exportCSV = () => {

    const headers = [

      "Name",

      "Email",

      "Orders",

      "Total Spent",
    ];

    const rows =
      users.map((u) => ([

        u.name,

        u.email,

        u.ordersCount || 0,

        u.totalSpent || 0,
      ]));

    const csvContent = [

      headers.join(","),

      ...rows.map((r) =>
        r.join(",")
      ),

    ].join("\n");

    const blob =
      new Blob(

        [csvContent],

        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "users-data.csv"
    );

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );
  };

  return (

    <div className="flex min-h-screen bg-[#f5f6fa]">

      <AdminSidebar
        collapsed={collapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">

        <AdminTopbar
          onToggle={() =>

            setCollapsed(
              !collapsed
            )
          }
        />

        <main className="p-8">

          {/* HEADER */}
          <div
            className="flex items-center
                       justify-between
                       flex-wrap gap-4
                       mb-8"
          >

            <div>

              <h1
                className="text-3xl
                           font-bold
                           text-[#0B2545]"
              >
                Customers
              </h1>

              <p className="text-gray-500 mt-1">
                Manage and monitor your customer base activity
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={exportCSV}
                className="border border-gray-200
                           bg-white
                           px-5 py-3
                           rounded-2xl
                           font-medium"
              >
                Export CSV
              </button>

              <button
                onClick={() =>
                  setShowAdd(true)
                }
                className="bg-[#4a46a0]
                           text-white
                           px-5 py-3
                           rounded-2xl
                           font-medium"
              >
                + Add New Customer
              </button>

            </div>

          </div>

          {/* KPIS */}
          <div
            className="grid
                       grid-cols-1
                       md:grid-cols-2
                       gap-5 mb-8"
          >

            <KpiCard
              label="TOTAL CUSTOMERS"
              value={totalUsers}
              change={0}
              icon={Users}
            />

            <KpiCard
              label="ACTIVE TODAY"
              value={activeToday}
              change={0}
              icon={Activity}
            />

          </div>

          {/* TABLE CARD */}
          <div
            className="bg-white
                       rounded-3xl
                       border border-black/[0.05]
                       overflow-hidden"
          >

            {/* FILTER BAR */}
            <div
              className="p-5 border-b
                         border-black/[0.05]
                         flex items-center
                         justify-between
                         flex-wrap gap-4"
            >

              <input
                value={search}

                onChange={(e) => {

                  setSearch(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}

                placeholder="Search users..."

                className="border border-gray-200
                           rounded-2xl
                           px-4 py-3
                           w-[260px]
                           outline-none"
              />

              <p className="text-sm text-gray-500">

                Showing{" "}

                {paginatedUsers.length}

                {" "}of{" "}

                {filteredUsers.length}

                {" "}customers

              </p>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

              {loading ? (

                <div className="p-8">
                  Loading...
                </div>

              ) : (

                <UsersTable
                  users={paginatedUsers}

                  onDelete={(u) =>
                    setDeleteTarget(u)
                  }
                />

              )}

            </div>

            {/* PAGINATION */}
            <div
              className="flex items-center
                         justify-center
                         gap-2 p-5
                         border-t
                         border-black/[0.05]"
            >

              {[...Array(totalPages)].map(
                (_, i) => (

                  <button
                    key={i}

                    onClick={() =>
                      setCurrentPage(
                        i + 1
                      )
                    }

                    className={`w-10 h-10 rounded-xl text-sm font-medium transition

                    ${
                      currentPage ===
                      i + 1

                        ? "bg-[#4a46a0] text-white"

                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}

            </div>

          </div>

        </main>

      </div>

      {/* ADD USER */}
      {showAdd && (

        <AddUserModal

          onClose={() =>
            setShowAdd(false)
          }

          onSave={
            handleCreateUser
          }
        />

      )}

      {/* DELETE */}
      {deleteTarget && (

        <DeleteConfirmModal

          product={{
            name:
              deleteTarget.name,
          }}

          onClose={() =>
            setDeleteTarget(null)
          }

          onConfirm={
            handleDeleteUser
          }

          loading={
            deleteLoading
          }
        />

      )}

    </div>
  );
}