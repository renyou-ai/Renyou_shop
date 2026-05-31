export default function AdminTopbar({ onToggle }) {
  return (
    <header className="bg-white border-b border-black/[0.07] h-[60px] px-6
                       flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onToggle}
                className="text-gray-400 hover:text-gray-700 transition-colors text-lg">
          ☰
        </button>
        <input placeholder="Search orders, products, or customers..."
               className="w-[340px] bg-gray-100 rounded-full px-4 py-1.5
                          text-sm outline-none border border-transparent
                          focus:border-[#4a46a0]/30 focus:bg-white transition-all" />
      </div>
    </header>
  );
}