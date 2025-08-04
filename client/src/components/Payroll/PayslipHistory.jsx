// client/src/components/Payroll/PayslipHistory.jsx
import { useState, useEffect } from "react";
import { exportToCSV } from "../../utils/exportReport";

import api from "../../services/api";

export default function PayslipHistory({ employeeId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/payroll/history/${employeeId}`);
        setHistory(res.data.history);
      } catch (err) {
        alert("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [employeeId]);

  const handleExport = (payslip) => {
    const data = [{
      Month: new Date(payslip.year, payslip.month - 1).toLocaleDateString('en-US', { month: 'long' }),
      Year: payslip.year,
      "Basic Salary": payslip.basicSalary,
      "Total Allowances": payslip.grossSalary - payslip.basicSalary,
      "Total Deductions": payslip.grossSalary - payslip.netSalary,
      "Net Salary": payslip.netSalary,
      Status: payslip.status,
    }];

    exportToCSV(data, `${payslip.year}-${String(payslip.month).padStart(2, "0")}`);
  };

  if (loading) return <div className="py-8 text-gray-500 text-center">Loading...</div>;

  return (
    <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center p-6 border-gray-200 border-b">
        <h3 className="font-semibold text-gray-900 text-lg">Payslip History</h3>
        <button
          onClick={() => exportToCSV(history.map(h => ({
            Month: new Date(h.year, h.month - 1).toLocaleDateString('en-US', { month: 'long' }),
            Year: h.year,
            "Net Salary": h.netSalary,
            Status: h.status,
          })), "payslip-history")}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium text-white text-sm"
        >
          Export All
        </button>
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-gray-500 text-center">No payslips generated</div>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Month</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Gross</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Net</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((h) => (
              <tr key={h._id} className="hover:bg-gray-50/30">
                <td className="px-6 py-4 text-sm">
                  {new Date(h.year, h.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-sm">Rs.{h.grossSalary.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">Rs.{h.netSalary.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    h.status === "Paid" ? "bg-green-100 text-green-800" :
                    h.status === "Generated" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {h.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleExport(h)}
                    className="text-indigo-600 hover:text-indigo-800 text-xs"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}