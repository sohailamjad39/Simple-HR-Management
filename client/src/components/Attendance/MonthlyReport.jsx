// client/src/components/Attendance/MonthlyReport.jsx
import { useState, useEffect } from "react";
import { exportToCSV } from "../../utils/exportReport";
import api from "../../services/api";

const CACHE_KEY = "attendance_monthly_cache";

export default function MonthlyReport({ month, setMonth }) {
  const [report, setReport] = useState(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data, month: cachedMonth } = JSON.parse(saved);
        // Optional: only reuse if same month
        // Otherwise, just show something while fresh loads
        if (cachedMonth === month) {
          return Array.isArray(data) ? data : [];
        }
      } catch (e) {
        console.warn("Failed to parse cached monthly report", e);
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // ✅ Fetch fresh data in background
  const fetchFreshData = async () => {
    setLoading(true);
    const [year, m] = month.split("-");
    try {
      const res = await api.get("/attendance/monthly", { params: { month: m, year } });
      const data = Array.isArray(res.data.data?.data) ? res.data.data.data : [];

      setReport(data);
      // ✅ Update cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, month, timestamp: Date.now() })
      );
    } catch (err) {
      console.error("Failed to load monthly report", err);
      // ✅ Keep showing cached data
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load cached data on mount, then fetch fresh
  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data, month: cachedMonth } = JSON.parse(saved);
        if (cachedMonth === month && Array.isArray(data)) {
          setReport(data);
        }
      } catch (e) {
        console.warn("Failed to read cached monthly report", e);
      }
    }

    // ✅ Always fetch fresh data in background
    fetchFreshData();
  }, [month]);

  // ✅ Listen for global updates (e.g., after add/edit attendance)
  useEffect(() => {
    const handleRefresh = () => {
      fetchFreshData();
    };

    window.addEventListener("data-updated", handleRefresh);
    return () => {
      window.removeEventListener("data-updated", handleRefresh);
    };
  }, [month]);

  const handleExport = () => {
    if (report.length === 0) return;
    setExportLoading(true);
    exportToCSV(report, month);
    setExportLoading(false);
  };

  return (
    <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap justify-between items-center gap-4 p-4 border-gray-200 border-b">
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={exportLoading || report.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
        >
          {exportLoading ? "Generating..." : "Download CSV"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Employee</th>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Total Days</th>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Present</th>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Late</th>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Leave</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {report.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-gray-500 text-center">
                {loading ? "Loading..." : "No data available for this month"}
              </td>
            </tr>
          ) : (
            report.map((r) => (
              <tr key={r.employee._id} className="hover:bg-gray-50/30">
                <td className="px-6 py-4 font-medium text-sm">{r.employee.fullName}</td>
                <td className="px-6 py-4 text-sm">{r.totalDays}</td>
                <td className="px-6 py-4 text-sm">{r.present}</td>
                <td className="px-6 py-4 text-sm">{r.late}</td>
                <td className="px-6 py-4 text-sm">{r.leave}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}