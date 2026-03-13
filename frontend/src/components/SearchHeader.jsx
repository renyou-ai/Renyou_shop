function SearchHeader() {

  return (

    <div className="bg-[#E8E5F4] mx-6 mt-4 rounded-full px-8 py-3 flex items-center gap-6">

      <button className="bg-[#524E8D] text-white px-5 py-2 rounded-lg">
        Renyou AI
      </button>

      <div className="flex-1 relative">

        <input
          placeholder="Medicine and healthcare items"
          className="w-full bg-white rounded-full py-3 px-12 outline-none border border-gray-200"
        />

        <span className="absolute left-4 top-2.5 text-lg">
          🔍
        </span>

      </div>

      <span className="text-xl cursor-pointer">🛒</span>
      <span className="text-xl cursor-pointer">👤</span>

    </div>

  );

}

export default SearchHeader;