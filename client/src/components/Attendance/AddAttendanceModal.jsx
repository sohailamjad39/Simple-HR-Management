// client/src/components/Attendance/AddAttendanceModal.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AddAttendanceModal({ employees, onClose, onSuccess, existingAttendance }) {
  const [formData, setFormData] = useState({
    employee: "",
    date: new Date().toISOString().split("T")[0],
    inTime: "",
    outTime: "",
    status: "Present",
    isLate: false,
    remarks: "",
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form if editing existing attendance
  useEffect(() => {
    if (existingAttendance) {
      setFormData({
        employee: existingAttendance.employee._id,
        date: existingAttendance.date.split("T")[0],
        inTime: existingAttendance.inTime ? new Date(existingAttendance.inTime).toTimeString().slice(0, 5) : "",
        outTime: existingAttendance.outTime ? new Date(existingAttendance.outTime).toTimeString().slice(0, 5) : "",
        status: existingAttendance.status,
        isLate: existingAttendance.isLate,
        remarks: existingAttendance.remarks || "",
      });
    } else {
      setFormData({
        employee: "",
        date: new Date().toISOString().split("T")[0],
        inTime: "",
        outTime: "",
        status: "Present",
        isLate: false,
        remarks: "",
      });
    }
  }, [existingAttendance]);

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

    if (!formData.employee) {
      return setError("Please select an employee");
    }

    setLoading(true);

    try {
      const payload = { ...formData };
      let res;

      if (existingAttendance?._id) {
        // Update existing
        res = await api.patch(`/attendance/${existingAttendance._id}`, payload);
      } else {
        // Create new
        res = await api.post("/attendance/manual", payload);
      }

      onSuccess?.(res.data.data.attendance);
      onClose();
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      console.error("Attendance Error:", err);
      const message = err.response?.data?.message || err.message;

      setError(
        message.includes("already exists")
          ? "Attendance already exists and has been updated."
          : message || "Failed to save attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    [emp.fullName, emp.employeeId, emp.email, emp.department]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/90 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-lg overflow-hidden animate-fadeIn">
        <div className="p-6 border-gray-200 border-b">
          <h2 className="font-semibold text-gray-900 text-lg">
            {existingAttendance ? "Edit Attendance" : "Add Manual Attendance"}
          </h2>
          <p className="text-gray-600 text-sm">
            {existingAttendance
              ? "Update the attendance record"
              : "Record attendance for an employee"}
          </p>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {error && (
            <div className="bg-red-50 mb-4 px-3 py-2 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Employee *</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID..."
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
              />
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                className="mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
                required
                disabled={existingAttendance}
              >
                <option value="">Select Employee</option>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.fullName} ({emp.employeeId})
                    </option>
                  ))
                ) : (
                  <option disabled>No matching employees</option>
                )}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
                required
                disabled={existingAttendance}
              />
            </div>

            <div className="gap-3 grid grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">In Time</label>
                <input
                  type="time"
                  name="inTime"
                  value={formData.inTime}
                  onChange={handleChange}
                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-xs">Out Time</label>
                <input
                  type="time"
                  name="outTime"
                  value={formData.outTime}
                  onChange={handleChange}
                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
                <option value="Half-Day">Half-Day</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isLate"
                checked={formData.isLate}
                onChange={handleChange}
                className="border-gray-300 rounded w-4 h-4 text-indigo-600 cursor-pointer"
              />
              <label className="ml-2 text-gray-700 text-xs">Mark as Late</label>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-xs">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
                placeholder="Any notes..."
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full text-xs"
              />
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 bg-gray-50/50 p-6 border-gray-200 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-3 py-1 rounded text-white text-xs transition-colors cursor-pointer"
          >
            {loading 
              ? "Saving..." 
              : existingAttendance ? "Update Attendance" : "Add Attendance"
            }
          </button>
        </div>
      </div>
    </div>
  );
}