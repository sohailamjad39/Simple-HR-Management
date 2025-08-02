// client/src/pages/Employees.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchFilterBar from "../components/Employees/SearchFilterBar";
import EmployeeTable from "../components/Employees/EmployeeTable";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("fullName");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load employees"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ✅ Updated filter logic: includes employeeId
  const filteredEmployees = employees
    .filter((emp) => {
      const matchesSearch = !search
        ? true
        : emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
          emp.email.toLowerCase().includes(search.toLowerCase()) ||
          emp.phone.includes(search) ||
          emp.employeeId.toLowerCase().includes(search.toLowerCase()); // Added employeeId

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
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            >
              + Add Employee
            </button>
          </div>

          {error && (
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

          <EmployeeTable
            employees={filteredEmployees}
            loading={loading}
            onView={(id) => navigate(`/employees/${id}`)}
            onEdit={(id) => navigate(`/employees/${id}/edit`)}
          />
        </div>
      </div>
    </>
  );
};

export default Employees;