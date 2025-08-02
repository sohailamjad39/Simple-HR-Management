// client/src/components/Leave/EditLeaveModal.jsx
import { useState } from "react";
import api from "../../services/api";

export default function EditLeaveModal({ leave, employees, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    leaveType: leave.leaveType,
    startDate: new Date(leave.startDate).toISOString().split("T")[0],
    endDate: new Date(leave.endDate).toISOString().split("T")[0],
    reason: leave.reason,
    remarks: leave.remarks || "",
    coveredBy: leave.coveredBy?._id || "",
    status: leave.status,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await api.patch(`/leaves/${leave._id}`, formData);
      onSuccess(res.data.data);
      onClose(); 
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update leave"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/90 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-gray-200 border-b">
          <h2 className="font-semibold text-gray-900 text-lg">Edit Leave</h2>
          <p className="text-gray-600 text-sm">
            Update leave for <strong>{leave.employee?.fullName || "Unknown"}</strong>
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {error && (
            <div className="bg-red-50 mb-4 px-3 py-2 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Leave Type */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Leave Type *</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
              >
                {["Sick", "Casual", "Earned", "Maternity", "Paternity", "Unpaid"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="gap-3 grid grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Reason *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="2"
                placeholder="Reason for leave"
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
                required
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
                placeholder="Additional notes..."
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
              />
            </div>

            {/* Covered By */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Covered By</label>
              <select
                name="coveredBy"
                value={formData.coveredBy}
                onChange={handleChange}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
              >
                <option value="">Not assigned</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.fullName}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 bg-gray-50/50 p-6 border-gray-200 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700 text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-3 py-1 rounded text-white text-xs transition-colors"
          >
            {loading ? "Updating..." : "Update Leave"}
          </button>
        </div>
      </div>
    </div>
  );
}