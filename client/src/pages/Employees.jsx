// client/src/pages/Employees.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchFilterBar from "../components/Employees/SearchFilterBar";
import EmployeeTable from "../components/Employees/EmployeeTable";

const CACHE_KEY = "employees_cached_data";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Only true on first ever load
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("fullName");

  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data } = JSON.parse(saved);
        setEmployees(data); 
        setLoading(false);
      } catch (e) {
        console.warn("Failed to parse cached employees", e);
      }
    } else {
      setLoading(true); // First-time load needs spinner
    }

    // Always fetch fresh data in background
    fetchFreshData();
  }, []);

  // Fetch fresh data without blocking UI
  const fetchFreshData = async () => {
    try {
      const res = await api.get("/employees");
      const data = Array.isArray(res.data.data) ? res.data.data : [];

      // Update state and cache
      setEmployees(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
      setError("");
    } catch (err) {
      // Keep showing cached data if API fails
      console.error("Failed to load fresh employees", err);
      setError(err.response?.data?.message || "Failed to refresh employee list");
    }
  };

  // Listen for external updates (e.g., after add/edit)
  useEffect(() => {
    const handleRefresh = () => {
      fetchFreshData(); // Re-fetch in background
    };

    window.addEventListener("data-updated", handleRefresh);
    return () => {
      window.removeEventListener("data-updated", handleRefresh);
    };
  }, []);

  // Filter & Sort
  const filteredEmployees = employees
    .filter((emp) => {
      const matchesSearch = !search
        ? true
        : emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          emp.email?.toLowerCase().includes(search.toLowerCase()) ||
          emp.phone?.includes(search) ||
          emp.employeeId?.toLowerCase().includes(search.toLowerCase());

      const matchesDept = department ? emp.department === department : true;
      const matchesStatus = status ? emp.status === status : true;

      return matchesSearch && matchesDept && matchesStatus;
    })
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />

        <div className="mx-auto p-6 pt-20 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl">Employee Management</h1>
            <button
              onClick={() => navigate("/employees/add")}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
            >
              + Add Employee
            </button>
          </div>

          {/* Persistent error (only if no cache) */}
          {error && employees.length === 0 && (
            <div className="bg-red-50 mb-6 px-4 py-3 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <SearchFilterBar
            search={search}
            setSearch={setSearch}
            department={department}
            setDepartment={setDepartment}
            status={status}
            setStatus={setStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            departments={["HR", "Engineering", "Finance", "Marketing", "Sales"]}
          />

          {/* Show table immediately with cached data */}
          <EmployeeTable
            employees={filteredEmployees}
            loading={loading} // Only shows loader on first-time load
            onView={(id) => navigate(`/employees/${id}`)}
            onEdit={(id) => navigate(`/employees/${id}/edit`)}
          />
        </div>
      </div>
    </>
  );
};

export default Employees;