// client/src/components/Leave/StatusUpdateModal.jsx
import { useState } from "react";

export default function StatusUpdateModal({ type, leave, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(leave._id, type === "approve" ? "Approved" : "Rejected", remarks);
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/90 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="p-6">
          <h2 className="mb-2 font-semibold text-gray-900 text-xl">
            {type === "approve" ? "Approve" : "Reject"} Leave
          </h2>
          <p className="mb-4 text-gray-600">
            For <strong>{leave.employee?.fullName}</strong> – {leave.leaveType}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700 text-sm">Remarks (Optional)</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                rows="3"
                placeholder="Enter remarks..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
                  type === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {type === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}