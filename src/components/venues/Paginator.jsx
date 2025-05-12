export default function Paginator({ page, totalPages, setPage, loading }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 mt-8 justify-center">
      <button
        className="px-2 py-1 rounded border bg-white text-[#0C5560] hover:bg-[#094147] hover:text-white transition disabled:opacity-50"
        onClick={() => setPage(1)}
        disabled={loading || page === 1}
        aria-label="First page"
      >
        &laquo;
      </button>
      <button
        className="px-2 py-1 rounded border bg-white text-[#0C5560] hover:bg-[#094147] hover:text-white transition disabled:opacity-50"
        onClick={() => setPage(page - 1)}
        disabled={loading || page === 1}
        aria-label="Previous page"
      >
        &lt;
      </button>
      <span className="text-lg font-semibold px-2">{page}</span>
      <button
        className="px-2 py-1 rounded border bg-white text-[#0C5560] hover:bg-[#094147] hover:text-white transition disabled:opacity-50"
        onClick={() => setPage(page + 1)}
        disabled={loading || page === totalPages}
        aria-label="Next page"
      >
        &gt;
      </button>
      <button
        className="px-2 py-1 rounded border bg-white text-[#0C5560] hover:bg-[#094147] hover:text-white transition disabled:opacity-50"
        onClick={() => setPage(totalPages)}
        disabled={loading || page === totalPages}
        aria-label="Last page"
      >
        &raquo;
      </button>
    </div>
  );
} 