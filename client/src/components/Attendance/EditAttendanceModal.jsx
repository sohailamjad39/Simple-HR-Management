// client/src/components/Attendance/EditAttendanceModal.jsx
import { useState } from "react";
import api from "../../services/api";

export default function EditAttendanceModal({ attendance, employees, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    inTime: attendance.inTime ? new Date(attendance.inTime).toTimeString().slice(0, 5) : "",
    outTime: attendance.outTime ? new Date(attendance.outTime).toTimeString().slice(0, 5) : "",
    status: attendance.status,
    isLate: attendance.isLate,
    remarks: attendance.remarks || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await api.patch(`/attendance/${attendance._id}`, formData);

      onSuccess(res.data.attendance);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/90 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-lg overflow-hidden animate-fadeIn">
        <div className="p-6">
          <h2 className="mb-1 font-semibold text-gray-900 text-xl">Edit Attendance</h2>
          <p className="mb-4 text-gray-600 text-sm">
            For {attendance.employee.fullName} on {new Date(attendance.date).toLocaleDateString()}
          </p>

          {error && (
            <div className="bg-red-50 mb-4 px-3 py-2 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* In/Out Time */}
            <div className="gap-4 grid grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">In Time</label>
                <input
                  type="time"
                  name="inTime"
                  value={formData.inTime}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Out Time</label>
                <input
                  type="time"
                  name="outTime"
                  value={formData.outTime}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
                <option value="Half-Day">Half-Day</option>
              </select>
            </div>

            {/* Late */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isLate"
                checked={formData.isLate}
                onChange={handleChange}
                className="border-gray-300 rounded w-4 h-4 text-indigo-600"
              />
              <label className="ml-2 text-gray-700 text-sm">Mark as Late</label>
            </div>

            {/* Remarks */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
                placeholder="Any notes..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}