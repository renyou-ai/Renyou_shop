import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const NAV = [

  {
    label: "Dashboard",
    Icon: LayoutDashboard,
    path: "/admin/dashboard",
  },

  {
    label: "Users",
    Icon: Users,
    path: "/admin/users",
  },

  {
    label: "Products",
    Icon: Package,
    path: "/admin/products",
  },

  {
    label: "Orders",
    Icon: ShoppingBag,
    path: "/admin/orders",
  },
];

export default function AdminSidebar({
  collapsed,
}) {

  const { logoutUser } =
    useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const handleLogout = () => {

    logoutUser();

    navigate("/login");
  };

  return (

    <aside
      className={`${
        collapsed
          ? "w-[70px]"
          : "w-[210px]"
      }
      flex-shrink-0
      bg-[#2e2a6e]
      flex flex-col
      transition-all duration-200
      sticky top-0 h-screen`}
    >

      {/* LOGO */}
      <div
        className="flex items-center gap-2.5
                   px-5 h-[60px]
                   border-b border-white/10"
      >

        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >

          <circle
            cx="9"
            cy="14"
            r="7"
            fill="white"
            fillOpacity="0.9"
          />

          <circle
            cx="19"
            cy="14"
            r="7"
            fill="white"
            fillOpacity="0.5"
          />

        </svg>

        {!collapsed && (

          <span
            className="text-white
                       font-bold text-lg
                       tracking-tight"
          >
            Renyou
          </span>

        )}

      </div>

      {/* NAVIGATION */}
      <nav
        className="flex-1 py-4 px-2
                   flex flex-col gap-0.5"
      >

        {NAV.map((item) => (

          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3
              px-3 py-2.5 rounded-xl
              text-sm font-medium
              transition-all duration-150
              ${
                location.pathname === item.path
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
          >

            <item.Icon
              size={18}
              className="flex-shrink-0"
            />

            {!collapsed && (
              <span>
                {item.label}
              </span>
            )}

          </Link>

        ))}

      </nav>

      {/* FOOTER */}
      <div
        className="px-3 py-4
                   border-t border-white/10"
      >

        <button
          onClick={handleLogout}
          className="flex items-center gap-3
                     w-full px-3 py-2.5
                     rounded-xl
                     text-white/60
                     hover:bg-white/10
                     hover:text-white
                     text-sm font-medium
                     transition-all"
        >

          <LogOut
            size={18}
            className="flex-shrink-0"
          />

          {!collapsed && (
            <span>
              Logout
            </span>
          )}

        </button>

        {!collapsed && (

          <div
            className="flex items-center gap-2.5
                       px-3 mt-2"
          >

            <div
              className="w-8 h-8 rounded-full
                         bg-white/20
                         flex items-center
                         justify-center
                         text-white text-xs
                         font-bold"
            >
              A
            </div>

            <span
              className="text-white/70
                         text-xs font-medium"
            >
              Administrator
            </span>

          </div>

        )}

      </div>

    </aside>
  );
}