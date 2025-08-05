// client/src/components/Payroll/GeneratePayslip.jsx
import { useState } from "react";
import { exportToCSV } from "../../utils/exportReport";
import api from "../../services/api";
import SuccessToast from "../SuccessToast"; 

export default function GeneratePayslip({ employee }) {
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 0,
    allowances: { HRA: 0, Travel: 0, Medical: 0 },
    deductions: { Tax: 0, PF: 0, Leaves: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleMapChange = (type, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: Number(value) },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const res = await api.post("/payroll/generate", {
        employee: employee._id,
        ...formData,
      });

      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3300);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate payslip");
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslip = () => {
    if (!employee) {
      console.error("Employee is not selected");
      return;
    }

    const data = [
      {
        Employee: employee.fullName,
        "Employee ID": employee.employeeId,
        Month: new Date(formData.year, formData.month - 1).toLocaleString(
          "default",
          { month: "long" }
        ),
        Year: formData.year,
        "Basic Salary": formData.basicSalary,
        "Total Allowances": totalAllowances,
        "Total Deductions": totalDeductions,
        "Net Salary": netSalary,
      },
    ];

    exportToCSV(
      data,
      `${formData.year}-${String(formData.month).padStart(2, "0")}`
    );
  };

  const totalAllowances = Object.values(formData.allowances).reduce(
    (a, b) => a + b,
    0
  );
  const totalDeductions = Object.values(formData.deductions).reduce(
    (a, b) => a + b,
    0
  );
  const netSalary = formData.basicSalary + totalAllowances - totalDeductions;

  return (
    <>
      {showSuccess && (
        <SuccessToast
          message="Payslip generated successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-6 border-gray-200 border-b">
          <h3 className="font-semibold text-gray-900 text-lg">
            Generate Payslip
          </h3>
          <p className="text-gray-600">{employee.fullName}</p>
        </div>

        {error && (
          <div className="bg-red-50 px-6 py-3 border-red-200 border-b text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Month
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2020, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                min="2020"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
            />
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-gray-900">Allowances</h4>
              {Object.keys(formData.allowances).map((key) => (
                <div key={key} className="mb-2">
                  <label className="block mb-1 text-gray-600 text-xs">
                    {key}
                  </label>
                  <input
                    type="number"
                    value={formData.allowances[key]}
                    onChange={(e) =>
                      handleMapChange("allowances", key, e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded w-full text-sm"
                  />
                </div>
              ))}
            </div>

            <div>
              <h4 className="mb-2 font-medium text-gray-900">Deductions</h4>
              {Object.keys(formData.deductions).map((key) => (
                <div key={key} className="mb-2">
                  <label className="block mb-1 text-gray-600 text-xs">
                    {key}
                  </label>
                  <input
                    type="number"
                    value={formData.deductions[key]}
                    onChange={(e) =>
                      handleMapChange("deductions", key, e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded w-full text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 bg-gray-50/50 p-4 rounded-lg text-sm">
            <div className="flex justify-between">
              <span>Gross Salary:</span>
              <span>
                Rs.{(formData.basicSalary + totalAllowances).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Deductions:</span>
              <span>Rs.{totalDeductions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-gray-900">
              <span>Net Salary:</span>
              <span>Rs.{netSalary.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={downloadPayslip}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition-colors cursor-pointer"
            >
              Download CSV
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-4 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
            >
              {loading ? "Generating..." : "Generate Payslip"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}