// client/src/pages/Settings.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DepartmentManager from "../components/Settings/DepartmentManager";
import LeaveTypeManager from "../components/Settings/LeaveTypeManager";
import AttendanceRules from "../components/Settings/AttendanceRules";
import SalaryConfig from "../components/Settings/SalaryConfig";
import SecuritySettings from "../components/Settings/SecuritySettings";
import api from "../services/api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("departments");

  const tabs = [
    { id: "departments", label: "Departments & Roles" },
    { id: "leave", label: "Leave Types" },
    { id: "attendance", label: "Attendance Rules" },
    { id: "salary", label: "Salary Config" },
    { id: "security", label: "Password & Security" },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />
        <div className="mx-auto p-6 pt-20 max-w-6xl">
          <h1 className="mb-6 font-bold text-gray-900 text-2xl">Settings</h1>

          {/* Tabs */}
          <div className="flex mb-6 border-gray-200 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {activeTab === "departments" && <DepartmentManager />}
            {activeTab === "leave" && <LeaveTypeManager />}
            {activeTab === "attendance" && <AttendanceRules />}
            {activeTab === "salary" && <SalaryConfig />}
            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;