// client/src/components/Attendance/DailyAttendance.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import EditAttendanceModal from "./EditAttendanceModal";
import ConfirmModal from "./ConfirmModal";
import AttendanceFilters from "./AttendanceFilters";

const CACHE_KEY = "attendance_daily_cache";

export default function DailyAttendance({ date, setDate, onSuccess }) {
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data } = JSON.parse(saved);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.warn("Failed to parse cached attendance", e);
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    isLate: "",
  });

  const handleReset = () => {
    setFilters({
      search: "",
      status: "",
      isLate: "",
    });
  };

  // ✅ Fetch fresh data in background
  const fetchFreshData = async () => {
    if (!date) return;
    try {
      const res = await api.get("/attendance/daily", {
        params: { date, ...filters },
      });
      const data = Array.isArray(res.data.fullAttendance) ? res.data.fullAttendance : [];

      setAttendance(data);
      // ✅ Update cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, date, filters, timestamp: Date.now() })
      );
    } catch (err) {
      console.error("Attendance fetch error:", err);
      // ✅ Keep showing cached data
    }
  };

  // ✅ Load cached data on mount, then fetch fresh
  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data, date: cachedDate, filters: cachedFilters } = JSON.parse(saved);

        // Optional: only reuse if same date/filters
        // Otherwise, just show something while fresh loads
        if (cachedDate === date && JSON.stringify(cachedFilters) === JSON.stringify(filters)) {
          setAttendance(data);
        }
      } catch (e) {
        console.warn("Failed to read cache", e);
      }
    }

    // ✅ Always fetch fresh data in background
    fetchFreshData();
  }, [date, filters]);

  // ✅ Listen for global updates (e.g., add/edit/delete)
  useEffect(() => {
    const handleRefresh = () => {
      fetchFreshData();
    };

    window.addEventListener("data-updated", handleRefresh);
    return () => {
      window.removeEventListener("data-updated", handleRefresh);
    };
  }, [date, filters]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/attendance/${id}`);
      setAttendance((prev) => prev.filter((att) => att._id !== id));
      onSuccess?.();
    } catch (err) {
      alert("Failed to delete attendance");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <>
      {/* Edit Modal */}
      {showEditModal && (
        <EditAttendanceModal
          attendance={showEditModal}
          employees={[]}
          onClose={() => setShowEditModal(null)}
          onSuccess={(updated) => {
            setAttendance((prev) =>
              prev.map((att) => (att._id === updated._id ? updated : att))
            );
            setShowEditModal(null);
            onSuccess?.();
          }}
        />
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <ConfirmModal
          isOpen={true}
          title="Confirm Delete"
          message={`Are you sure you want to delete attendance for ${confirmDelete.name}?`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Attendance Table */}
      <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        {/* Date Picker */}
        <div className="p-4 border-gray-200 border-b">
          <label className="block mb-1 font-medium text-gray-700 text-sm">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        {/* Filters */}
        <AttendanceFilters
          filters={filters}
          setFilters={setFilters}
          onReset={handleReset}
        />

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Employee</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">In / Out</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Late</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-gray-500 text-center">
                  No records found
                </td>
              </tr>
            ) : (
              attendance.map((att) => (
                <tr key={att._id || att.employee._id} className="hover:bg-gray-50/30">
                  <td className="px-6 py-4 font-medium text-sm">{att.employee.fullName}</td>
                  <td className="px-6 py-4 text-sm">{att.status}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {att.inTime ? new Date(att.inTime).toLocaleTimeString([], { timeStyle: 'short' }) : "-"} /{" "}
                    {att.outTime ? new Date(att.outTime).toLocaleTimeString([], { timeStyle: 'short' }) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        att.isLate
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {att.isLate ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="space-x-2 px-6 py-4 text-sm">
                    {att._id ? (
                      <>
                        <button
                          onClick={() => setShowEditModal(att)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setConfirmDelete({
                              id: att._id,
                              name: att.employee.fullName,
                            })
                          }
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ✅ Optional: Show "Updating..." in corner */}
        {loading && (
          <div className="top-2 right-2 absolute text-gray-500 text-xs">Loading...</div>
        )}
      </div>
    </>
  );
}