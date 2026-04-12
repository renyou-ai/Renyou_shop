import { useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/icons/logo_renyou.svg";
import searchIcon from "../assets/icons/loupe.svg";
import cartIcon from "../assets/icons/cart.svg";
import userIcon from "../assets/icons/guy.svg";

import SearchHeader from "./SearchHeader";
import { useAuth } from "../context/AuthContext";

// 🔥 AJOUT : recevoir setSearch
function Navbar({ setSearch }) {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const { token, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // 🔥 replace navbar by search
  if (showSearch) {
    return (
      <SearchHeader
        closeSearch={() => setShowSearch(false)}
        setSearch={setSearch} // 🔥 AJOUT
      />
    );
  }

  return (
    <div className="bg-[#E8E5F4] rounded-full mx-6 mt-6 px-10 py-4 flex items-center justify-between shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-10">

        <img
          src={logo}
          alt="Renyou"
          className="h-8 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <nav className="hidden md:flex gap-8 text-[#0B1A2B] font-medium">

          <a onClick={() => navigate("/shop")} className="hover:text-purple-600 cursor-pointer">Skincare</a>
          <a onClick={() => navigate("/shop")} className="hover:text-purple-600 cursor-pointer">Haircare</a>
          <a onClick={() => navigate("/shop")} className="hover:text-purple-600 cursor-pointer">Bodycare</a>
          <a onClick={() => navigate("/shop")} className="hover:text-purple-600 cursor-pointer">Brands</a>
          <a onClick={() => navigate("/shop")} className="hover:text-purple-600 cursor-pointer">Offers</a>
          <a onClick={() => navigate("/shop")} className="hover:text-purple-600 cursor-pointer">Learn</a>

        </nav>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        <button
          onClick={() => navigate("/chatbot")}
          className="bg-[#524E8D] text-white px-5 py-2 rounded-lg hover:opacity-90"
        >
          Renyou AI
        </button>

        <img
          src={searchIcon}
          alt="search"
          className="w-5 h-5 cursor-pointer hover:opacity-70"
          onClick={() => setShowSearch(true)}
        />

        <img
          src={cartIcon}
          alt="cart"
          className="w-6 h-6 cursor-pointer hover:opacity-70"
          onClick={() => navigate("/cart")}
        />

        {/* 🔐 USER / LOGOUT */}
        {token ? (
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-[#0B1A2B] hover:text-red-500 transition"
          >
            Logout
          </button>
        ) : (
          <img
            src={userIcon}
            alt="user"
            className="w-6 h-6 cursor-pointer hover:opacity-70"
            onClick={() => navigate("/login")}
          />
        )}

      </div>

    </div>
  );
}

export default Navbar;