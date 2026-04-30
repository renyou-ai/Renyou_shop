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

  const { cart = [] } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + (item.qty || 0), 0);

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

        <button
          onClick={() => navigate("/shop")}
          className="hover:text-[#645CD5] transition"
        >
          Skincare
        </button>

        <button
          onClick={() => navigate("/shop")}
          className="hover:text-[#645CD5] transition"
        >
          Haircare
        </button>

        <button
          onClick={() => navigate("/shop")}
          className="hover:text-[#645CD5] transition"
        >
          Bodycare
        </button>

        <button
          onClick={() => navigate("/shop")}
          className="hover:text-[#645CD5] transition"
        >
          Brands
        </button>

        <button
          onClick={() => navigate("/shop")}
          className="hover:text-[#645CD5] transition"
        >
          Offers
        </button>

        <button
          onClick={() => navigate("/shop")}
          className="hover:text-[#645CD5] transition"
        >
          Learn
        </button>

      </nav>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white
          bg-gradient-to-r from-[#34306F] to-[#645CD5]"
        >
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

        <button onClick={() => navigate("/profile")}>
          <img src={userIcon} className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}

export default Navbar;