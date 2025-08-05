// client/src/components/Settings/AttendanceRules.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import SuccessToast from "../SuccessToast";

const CACHE_KEY = "attendance_rules_cache";

export default function AttendanceRules() {
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data } = JSON.parse(saved);
        return {
          shiftStart: data.shiftStart || "09:00",
          shiftEnd: data.shiftEnd || "18:00",
          gracePeriod: data.gracePeriod || 15,
          holidays: Array.isArray(data.holidays) ? data.holidays : [],
        };
      } catch (e) {
        console.warn("Failed to parse cached attendance rules", e);
      }
    }
    return {
      shiftStart: "09:00",
      shiftEnd: "18:00",
      gracePeriod: 15,
      holidays: [],
    };
  });

  const [newHoliday, setNewHoliday] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Fetch fresh data in background
  const fetchFreshRules = async () => {
    setLoading(true);
    try {
      const res = await api.get("/settings/attendance-rules");
      const data = res.data.data || {};

      const freshRules = {
        shiftStart: data.shiftStart || "09:00",
        shiftEnd: data.shiftEnd || "18:00",
        gracePeriod: data.gracePeriod || 15,
        holidays: Array.isArray(data.holidays) ? data.holidays : [],
      };

      setRules(freshRules);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: freshRules }));
    } catch (err) {
      console.error("Failed to load attendance rules", err);
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
        const { data } = JSON.parse(saved);
        setRules({
          shiftStart: data.shiftStart || "09:00",
          shiftEnd: data.shiftEnd || "18:00",
          gracePeriod: data.gracePeriod || 15,
          holidays: Array.isArray(data.holidays) ? data.holidays : [],
        });
      } catch (e) {
        console.warn("Failed to read cached rules", e);
      }
    }

    // ✅ Always fetch fresh data in background
    fetchFreshRules();
  }, []);

  // ✅ Listen for global updates (e.g., from other settings)
  useEffect(() => {
    const handleRefresh = () => {
      fetchFreshRules();
    };

    window.addEventListener("data-updated", handleRefresh);
    return () => {
      window.removeEventListener("data-updated", handleRefresh);
    };
  }, []);

  const handleAddHoliday = () => {
    if (!newHoliday || rules.holidays.includes(newHoliday)) return;
    setRules((prev) => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday],
    }));
    setNewHoliday("");
  };

  const handleRemoveHoliday = (date) => {
    setRules((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((d) => d !== date),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRules((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/settings/attendance-rules", rules);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: rules }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // ✅ Notify global system
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      console.error("Failed to save attendance rules", err);
      alert("Failed to save rules");
    }
  };

  return (
    <>
      {/* ✅ Success Toast */}
      {showSuccess && (
        <SuccessToast
          message="Attendance rules saved successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="bg-white/70 border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-6 border-gray-200 border-b">
          <h3 className="font-semibold text-gray-900 text-lg">Attendance Rules</h3>
          <p className="text-gray-600 text-sm">Configure shift timings, grace period, and holidays</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Shift Start Time</label>
              <input
                type="time"
                name="shiftStart"
                value={rules.shiftStart}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Shift End Time</label>
              <input
                type="time"
                name="shiftEnd"
                value={rules.shiftEnd}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Grace Period (minutes)</label>
              <input
                type="number"
                name="gracePeriod"
                value={rules.gracePeriod}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                min="0"
                max="60"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Holidays</label>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddHoliday}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {rules.holidays.map((date) => (
                <span
                  key={date}
                  className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-gray-800 text-sm"
                >
                  {new Date(date).toLocaleDateString()}
                  <button
                    type="button"
                    onClick={() => handleRemoveHoliday(date)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-6 py-2 rounded-lg font-medium text-white transition-colors"
            >
              {loading ? "Saving..." : "Save Rules"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}