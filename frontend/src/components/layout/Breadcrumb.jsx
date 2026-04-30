import { ChevronRight } from "lucide-react";

function Breadcrumb() {
  return (
    <div className="flex items-center text-sm text-gray-500 mb-6">

      <span className="hover:text-black cursor-pointer">
        Home
      </span>

      <ChevronRight size={16} className="mx-2" />

      <span className="font-medium text-gray-800">
        Vitamins & Supplements
      </span>

    </div>
  );
}

export default Breadcrumb;