// client/src/pages/Attendance.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DailyAttendance from "../components/Attendance/DailyAttendance";
import MonthlyReport from "../components/Attendance/MonthlyReport";
import AddAttendanceModal from "../components/Attendance/AddAttendanceModal";

const CACHE_KEY = "attendance_cached_data";

const Attendance = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("daily");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showAddModal, setShowAddModal] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ✅ Load cached attendance on mount
  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data } = JSON.parse(saved);
        setAttendance(data); // ✅ Show cached data instantly
      } catch (e) {
        console.warn("Failed to parse cached attendance", e);
      }
    }

    // ✅ Always fetch fresh data in background
    fetchFreshAttendance();
  }, []);

  // ✅ Fetch fresh data without blocking UI
  const fetchFreshAttendance = async () => {
    try {
      const res = await api.get("/attendance/daily", { params: { date } });
      const data = Array.isArray(res.data.fullAttendance) ? res.data.fullAttendance : [];

      setAttendance(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (err) {
      console.error("Failed to load fresh attendance", err);
      // ✅ Keep showing cached data if API fails
    }
  };

  // ✅ Listen for external updates (e.g., after add/edit)
  useEffect(() => {
    const handleRefresh = () => {
      fetchFreshAttendance(); // Re-fetch in background
    };

    window.addEventListener("data-updated", handleRefresh);
    return () => {
      window.removeEventListener("data-updated", handleRefresh);
    };
  }, []);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };
    fetchEmployees();
  }, []);

  // Handle add/update
  const handleSuccess = (newAttendance) => {
    setAttendance((prev) => {
      const index = prev.findIndex(
        (a) =>
          a.employee._id === newAttendance.employee._id &&
          a.date === newAttendance.date
      );
      if (index > -1) {
        const updated = [...prev];
        updated[index] = newAttendance;
        return updated;
      }
      return [newAttendance, ...prev];
    });
    setShowAddModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />

        <div className="mx-auto p-6 pt-20 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl">Attendance</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            >
              + Add Manual
            </button>
          </div>

          <div className="flex mb-6 border-gray-200 border-b">
            {["daily", "monthly"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "daily" && (
              <DailyAttendance
                date={date}
                setDate={setDate}
                attendance={attendance}
                setAttendance={setAttendance}
              />
            )}
            {activeTab === "monthly" && (
              <MonthlyReport month={month} setMonth={setMonth} />
            )}
          </div>

          {showAddModal && (
            <AddAttendanceModal
              employees={employees}
              onClose={() => setShowAddModal(false)}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Attendance;