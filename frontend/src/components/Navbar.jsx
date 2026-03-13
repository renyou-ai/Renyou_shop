function Navbar() {
  return (

    <div className="bg-[#E8E5F4] rounded-full mx-6 mt-6 px-10 py-4 flex items-center justify-between shadow-sm">

      {/* LEFT */}

      <div className="flex items-center gap-10">

        <h1 className="text-xl font-bold text-[#0B1A2B] flex items-center gap-1">
          Renyou
          <span className="text-orange-500 text-sm">Shop</span>
        </h1>

        <nav className="hidden md:flex gap-8 text-[#0B1A2B] font-medium">

          <a className="hover:text-purple-600 cursor-pointer">
            Skincare
          </a>

          <a className="hover:text-purple-600 cursor-pointer">
            Haircare
          </a>

          <a className="hover:text-purple-600 cursor-pointer">
            Bodycare
          </a>

          <a className="hover:text-purple-600 cursor-pointer">
            Brands
          </a>

          <a className="hover:text-purple-600 cursor-pointer">
            Offers
          </a>

          <a className="hover:text-purple-600 cursor-pointer">
            Learn
          </a>

        </nav>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-6">

        <button className="bg-[#524E8D] text-white px-5 py-2 rounded-lg hover:opacity-90">
          Renyou AI
        </button>

        <span className="text-xl cursor-pointer">🔍</span>
        <span className="text-xl cursor-pointer">🛒</span>
        <span className="text-xl cursor-pointer">👤</span>

      </div>

    </div>

  );
}

export default Navbar;