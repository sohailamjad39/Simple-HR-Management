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

const Attendance = () => {
  const navigate = useNavigate();

  // Tabs
  const [activeTab, setActiveTab] = useState("daily");

  // Filters
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);

  const [attendance, setAttendance] = useState([]);

  // Employees (for modals)
  const [employees, setEmployees] = useState([]);

  // Fetch employees on mount
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

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />

        <div className="mx-auto p-6 pt-20 max-w-7xl">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl">Attendance</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            >
              + Add Manual
            </button>
          </div>

          {/* Tabs */}
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

          {/* Tab Content */}
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

          {/* Add Modal */}
          {showAddModal && (
            <AddAttendanceModal
              employees={employees}
              onClose={() => setShowAddModal(false)}
              onSuccess={(newAttendance) => {
                setAttendance((prev) => [newAttendance, ...prev]);
                setShowAddModal(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Attendance;