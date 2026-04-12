import { useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/icons/logo_renyou.svg";
import searchIcon from "../assets/icons/loupe.svg";
import cartIcon from "../assets/icons/cart.svg";
import userIcon from "../assets/icons/guy.svg";

function SearchHeader({ closeSearch, setSearch }) {

  const navigate = useNavigate();

  // 🔥 AJOUT : state input
  const [value, setValue] = useState("");

  // 🔥 AJOUT : handle submit
  const handleSearch = (e) => {
    e.preventDefault();

    setSearch(value); // envoie au Shop
    closeSearch();    // ferme la search bar
  };

  return (

    <div className="bg-[#E8E5F4] mx-6 mt-6 rounded-full px-10 py-4 flex items-center gap-6 shadow-sm">

      {/* Logo */}
      <img
        src={logo}
        alt="Renyou"
        className="h-8 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* AI Button */}
      <button
        onClick={() => navigate("/chatbot")}
        className="bg-[#524E8D] text-white px-5 py-2 rounded-lg hover:opacity-90"
      >
        Renyou AI
      </button>

      {/* 🔥 FORM WRAP AJOUT */}
      <form onSubmit={handleSearch} className="flex-1 relative">

        {/* Search */}
        <input
          placeholder="Medicine and healthcare items"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-white rounded-full py-3 pl-12 pr-12 outline-none border border-gray-200 focus:outline-none focus:ring-0"
        />

        <img
          src={searchIcon}
          alt="search"
          className="absolute left-4 top-3 w-5 h-5 opacity-70"
        />

        {/* CLOSE BUTTON */}
        <span
          onClick={closeSearch}
          className="absolute right-4 top-2.5 text-xl cursor-pointer text-gray-500"
        >
          ×
        </span>

      </form>

      {/* Cart */}
      <img
        src={cartIcon}
        alt="cart"
        className="w-6 h-6 cursor-pointer"
        onClick={() => navigate("/cart")}
      />

      {/* User */}
      <img
        src={userIcon}
        alt="user"
        className="w-6 h-6 cursor-pointer"
        onClick={() => navigate("/profile")}
      />

    </div>

  );
}

export default SearchHeader;