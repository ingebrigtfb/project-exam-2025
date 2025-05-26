import { FaExclamationTriangle } from 'react-icons/fa';

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-xl p-6 relative">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
            <FaExclamationTriangle className="text-red-500 text-xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="mt-2 text-gray-600">{message}</p>
          {itemName && (
            <p className="mt-2 font-medium text-gray-800">"{itemName}"</p>
          )}
        </div>
        
        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
} 