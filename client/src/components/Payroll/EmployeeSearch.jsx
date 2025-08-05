// client/src/components/Payroll/EmployeeSearch.jsx

import { useState } from "react";

export default function EmployeeSearch({
  employees,
  onSelect,
  selectedEmployee,
}) {
  const [search, setSearch] = useState("");

  const filtered = employees.filter((emp) =>
    [emp.fullName, emp.employeeId, emp.department]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white/70 shadow-sm backdrop-blur-sm mb-6 p-4 border border-gray-100 rounded-2xl">
      <label className="block mb-1 font-medium text-gray-700 text-sm">
        Search Employee
      </label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Name, ID, department..."
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
      />
      <div className="mt-2 max-h-40 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="mt-2 text-gray-500 text-sm">No employees found</p>
        ) : (
          <div className="space-y-1 mt-2">
            {filtered.map((emp) => (
              <button
                key={emp._id}
                type="button"
                onClick={() => onSelect(emp)}
                className={`w-full text-left px-3 py-2 rounded text-sm cursor-pointer transition-colors ${
                  selectedEmployee?._id === emp._id
                    ? "bg-indigo-100 text-indigo-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {emp.fullName} ({emp.employeeId}) • {emp.department}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
