import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "@/asset/icons/logo.svg";
import searchIcon from "@/asset/icons/search.svg";
import cartIcon from "@/asset/icons/cart.svg";
import userIcon from "@/asset/icons/user.svg";
import aiIcon from "@/asset/icons/ai.svg";

import { useCart } from "@/context/CartContext";

function SearchHeader({ closeSearch, setSearch }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const { cart = [] } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + (item.qty || 0), 0);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(value);
  };

  return (
    <div className="bg-[#E8E5F4] mx-6 mt-6 rounded-full px-6 py-3 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <button onClick={() => navigate("/home")}>
          <img src={logo} className="h-8" />
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white
          bg-gradient-to-r from-[#34306F] to-[#645CD5]"
        >
          Renyou AI
          <img src={aiIcon} className="h-4 w-4" />
        </button>

      </div>

      {/* CENTER SEARCH */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-[#F3F2F7] rounded-full px-4 py-2 w-full max-w-[1025px] mx-6"      >
        {/* ICON */}
        <div className="w-9 h-9 bg-[#4B3F8F] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <img src={searchIcon}  />
        </div>

        {/* INPUT */}
        <input
          placeholder="Medicine and healthcare items"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[14px] text-gray-500"
        />

        {/* CLOSE */}
        <button
          type="button"
          onClick={closeSearch}
          className="text-[#4B3F8F] text-xl ml-2"
        >
          ×
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* CART */}
        <button onClick={() => navigate("/cart")} className="relative">
          <img src={cartIcon} className="w-6 h-6" />

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>

        {/* USER */}
        <button onClick={() => navigate("/profile")}>
          <img src={userIcon} className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}

SearchHeader.propTypes = {
  closeSearch: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default SearchHeader;