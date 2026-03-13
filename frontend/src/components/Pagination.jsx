function Pagination({ currentPage, totalPages, setCurrentPage }) {

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (

    <div className="flex justify-center items-center gap-3 mt-12">

      {/* Prev */}

      <button
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >

        Prev

      </button>

      {/* Page Numbers */}

      {pages.map((page) => (

        <button

          key={page}

          onClick={() => setCurrentPage(page)}

          className={`px-4 py-2 rounded-lg border transition ${
            currentPage === page
              ? "bg-[#524E8D] text-white border-[#524E8D]"
              : "border-gray-300 hover:bg-gray-100"
          }`}

        >

          {page}

        </button>

      ))}

      {/* Next */}

      <button
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >

        Next

      </button>

    </div>

  );

}

export default Pagination;