import PropTypes from "prop-types";

export default function DeleteConfirmModal({ product, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🗑️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Product?</h3>
        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-600">"{product?.name}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteConfirmModal.propTypes = {
  product:   PropTypes.object,
  onClose:   PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading:   PropTypes.bool,
};