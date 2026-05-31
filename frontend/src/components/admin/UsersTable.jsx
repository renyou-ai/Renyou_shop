import {
  Trash2,
  Eye,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

function formatDate(date) {

  if (!date) {
    return "No orders";
  }

  return new Date(date)
    .toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
}

export default function UsersTable({
  users = [],
  onDelete,
}) {

  return (

    <div
      className="bg-white rounded-3xl
                 border border-black/[0.04]
                 overflow-hidden"
    >

      <div
        className="overflow-x-auto
                   max-h-[650px]
                   overflow-y-auto"
      >

        <table className="w-full min-w-[1000px] text-sm">

          {/* HEADER */}
          <thead
            className="sticky top-0
                       bg-white z-10"
          >

            <tr
              className="border-b
                         border-black/[0.06]"
            >

              {[
                "Customer",
                "Email",
                "Orders",
                "Total Spent",
                "Last Order",
                "Actions",
              ].map((h) => (

                <th
                  key={h}
                  className="text-left text-[11px]
                             font-semibold uppercase
                             tracking-widest text-gray-400
                             py-5 px-4"
                >
                  {h}
                </th>

              ))}

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {users.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center
                             py-16
                             text-gray-400"
                >
                  No users found
                </td>

              </tr>

            )}

            {users.map((user) => (

              <tr
                key={user._id}
                className="border-b
                           border-black/[0.04]
                           hover:bg-gray-50/60
                           transition"
              >

                {/* CUSTOMER */}
                <td className="py-5 px-4">

                  <div className="flex items-center gap-3">

                    <div
                      className="w-12 h-12 rounded-full
                                 bg-[#4a46a0]/10
                                 text-[#4a46a0]
                                 flex items-center
                                 justify-center
                                 font-semibold"
                    >
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <p
                        className="font-semibold
                                   text-gray-900"
                      >
                        {user.name}
                      </p>

                      <p
                        className="text-xs
                                   text-gray-400"
                      >
                        Joined{" "}
                        {formatDate(
                          user.createdAt
                        )}
                      </p>

                    </div>

                  </div>

                </td>

                {/* EMAIL */}
                <td
                  className="py-5 px-4
                             text-gray-600"
                >
                  {user.email}
                </td>

                {/* ORDERS */}
                <td
                  className="py-5 px-4
                             font-semibold
                             text-gray-900"
                >
                  {user.ordersCount || 0}
                </td>

                {/* TOTAL SPENT */}
                <td
                  className="py-5 px-4
                             font-semibold
                             text-[#4a46a0]"
                >
                  $
                  {(
                    user.totalSpent || 0
                  ).toLocaleString()}
                </td>

                {/* LAST ORDER */}
                <td
                  className="py-5 px-4
                             text-gray-500"
                >
                  {formatDate(
                    user.lastOrder
                  )}
                </td>

                {/* ACTIONS */}
                <td className="py-5 px-4">

                  <div className="flex items-center gap-2">

                    <Link
                      to={`/admin/users/${user._id}`}
                      className="w-10 h-10 rounded-xl
                                 border border-gray-200
                                 flex items-center
                                 justify-center
                                 hover:bg-gray-100
                                 transition"
                    >

                      <Eye
                        size={17}
                        className="text-gray-600"
                      />

                    </Link>

                    <button
                      onClick={() =>
                        onDelete(user)
                      }
                      className="w-10 h-10 rounded-xl
                                 border border-red-100
                                 flex items-center
                                 justify-center
                                 hover:bg-red-50
                                 transition"
                    >

                      <Trash2
                        size={17}
                        className="text-red-500"
                      />

                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}