// client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import OverviewCard from "../components/Dashboard/OverviewCard";
import QuickAction from "../components/Dashboard/QuickAction";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

// Icons
const UsersIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const ClockIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const BriefcaseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const AddIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const CalendarIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const DocumentIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CACHE_KEY = "dashboard_cached_data";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          totalEmployees: 0,
          activeInactive: { active: 0, inactive: 0 },
          upcomingLeaves: 0,
          vacantPositions: 0,
          urgentVacancies: 0,
          recentActivity: [],
          newThisWeek: 0,
          leavesThisWeek: 0,
        };
  });

  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/dashboard/stats");
      if (res.data.success && res.data.data) {
        setStats(res.data.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      console.log("Event caught:", e);
      fetchStats();
    };
    window.addEventListener("data-updated", handler);
    return () => window.removeEventListener("data-updated", handler);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) setStats(JSON.parse(saved));

    fetchStats();
  }, []);

  const quickActions = [
    { label: "Add Employee", icon: AddIcon, path: "/employees/add" },
    { label: "Mark Attendance", icon: CalendarIcon, path: "/attendance" },
    { label: "Manage Payroll", icon: DocumentIcon, path: "/payroll" },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />

        <div className="mx-auto p-6 pt-20 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl">Dashboard</h1>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-4 py-2 rounded-lg text-white text-sm"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <DashboardLayout>
            <OverviewCard
              title="Total Employees"
              value={stats.totalEmployees}
              subtitle={
                stats.newThisWeek > 0 ? `+${stats.newThisWeek} this week` : ""
              }
              icon={UsersIcon}
            />
            <OverviewCard
              title="Active vs Inactive"
              value={`${stats.activeInactive.active} / ${stats.activeInactive.inactive}`}
              subtitle={`${stats.activeInactive.inactive} inactive`}
              icon={UsersIcon}
            />
            <OverviewCard
              title="Upcoming Leaves"
              value={stats.upcomingLeaves}
              subtitle={
                stats.leavesThisWeek > 0
                  ? `${stats.leavesThisWeek} this week`
                  : ""
              }
              icon={ClockIcon}
            />
          </DashboardLayout>

          <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-8">
            <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
              <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {stats.recentActivity.map((act, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-gray-700 text-sm"
                  >
                    <div>
                      <p>{act.action}</p>
                      <p className="text-gray-500">{act.user}</p>
                    </div>
                    <span className="text-gray-400">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
              <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, i) => (
                  <QuickAction
                    key={i}
                    label={action.label}
                    icon={action.icon}
                    onClick={() => navigate(action.path)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
