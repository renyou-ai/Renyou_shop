import { useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "@/asset/icons/logo.svg";
import searchIcon from "@/asset/icons/search.svg";
import cartIcon from "@/asset/icons/cart.svg";
import userIcon from "@/asset/icons/user.svg";
import aiIcon from "@/asset/icons/ai.svg";

import SearchHeader from "@/components/layout/SearchHeader";
import { useCart } from "@/context/CartContext";

function Navbar({ setSearch }) {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { cart = [] } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + (item.qty || 0), 0);

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token"); // supprime token
    localStorage.removeItem("user"); // optionnel
    navigate("/login"); // redirection
    window.location.reload(); // force refresh (important)
  };

  if (showSearch) {
    return (
      <SearchHeader
        closeSearch={() => setShowSearch(false)}
        setSearch={setSearch}
      />
    );
  }

  return (
    <div className="bg-[#E8E5F4] mx-6 mt-6 rounded-full px-6 py-3 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/home")}>
          <img src={logo} className="h-8" />
        </button>
      </div>

      {/* CENTER */}
      <nav className="flex items-center gap-12 text-[#0B1A2B] text-[16px] font-medium tracking-wide">
        <button onClick={() => navigate("/shop")} className="hover:text-[#645CD5]">Skincare</button>
        <button onClick={() => navigate("/shop")} className="hover:text-[#645CD5]">Haircare</button>
        <button onClick={() => navigate("/shop")} className="hover:text-[#645CD5]">Bodycare</button>
        <button onClick={() => navigate("/shop")} className="hover:text-[#645CD5]">Brands</button>
        <button onClick={() => navigate("/shop")} className="hover:text-[#645CD5]">Offers</button>
        <button onClick={() => navigate("/shop")} className="hover:text-[#645CD5]">Learn</button>
      </nav>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#34306F] to-[#645CD5]">
          Renyou AI
          <img src={aiIcon} className="h-4 w-4" />
        </button>

        <button onClick={() => setShowSearch(true)}>
          <img src={searchIcon} className="w-5 h-5" />
        </button>

        <button onClick={() => navigate("/cart")} className="relative">
          <img src={cartIcon} className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>

        {/* 👇 USER MENU */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}>
            <img src={userIcon} className="w-6 h-6" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 z-50">
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;