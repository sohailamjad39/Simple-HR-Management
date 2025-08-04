// client/src/components/Attendance/ConfirmModal.jsx
export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
  
    return (
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm p-4">
        <div className="bg-white/90 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-md overflow-hidden animate-fadeIn">
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 text-lg">{title}</h2>
            <p className="mt-2 text-gray-600">{message}</p>
  
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }