// client/src/pages/Payroll.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SalaryDetails from "../components/Payroll/SalaryDetails";
import GeneratePayslip from "../components/Payroll/GeneratePayslip";
import PayslipHistory from "../components/Payroll/PayslipHistory";
import EmployeeSearch from "../components/Payroll/EmployeeSearch";

const Payroll = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("salary");
  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error("Failed to load employees");
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl">Payroll Management</h1>
            {employee && <p className="text-gray-600 text-sm">For: <strong>{employee.fullName}</strong></p>}
          </div>

          {/* Employee Search */}
          <EmployeeSearch
            employees={employees}
            onSelect={setEmployee}
            selectedEmployee={employee}
          />

          {!employee ? (
            <div className="bg-white/70 shadow-sm p-8 border border-gray-100 rounded-2xl text-gray-500 text-center">
              Select an employee to manage payroll
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex mb-6 border-gray-200 border-b">
                {["salary", "generate", "history"].map((tab) => (
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
                {activeTab === "salary" && (
                  <SalaryDetails employeeId={employee._id} />
                )}
                {activeTab === "generate" && (
                  <GeneratePayslip employee={employee} />
                )}
                {activeTab === "history" && (
                  <PayslipHistory employeeId={employee._id} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Payroll;