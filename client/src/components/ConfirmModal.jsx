// client/src/components/ConfirmModal.jsx
import { useEffect } from "react";

export default function ConfirmModal({ isOpen, title = "Confirm Action", message, onConfirm, onCancel }) {
  // ✅ Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onCancel]);

  // ✅ Don't render if not open
  if (!isOpen) return null;

  // ✅ Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm"
      onClick={onCancel} // Close on backdrop click
    >
      <div
        className="bg-white/95 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-md overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          <p className="mt-2 text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end gap-3 bg-gray-50/50 p-6 border-gray-200 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium text-gray-700 text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}