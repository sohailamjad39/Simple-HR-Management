// client/src/components/Payroll/SalaryDetails.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function SalaryDetails({ employeeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/payroll/salary/${employeeId}`);
        setData(res.data.data);
      } catch (err) {
        alert("Failed to load salary details");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [employeeId]);

  if (loading) return <div className="py-8 text-gray-500 text-center">Loading...</div>;
  if (!data) return <div className="py-8 text-gray-500 text-center">No data</div>;

  const { employee, current } = data;

  return (
    <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      <div className="p-6 border-gray-200 border-b">
        <h3 className="font-semibold text-gray-900 text-lg">Salary Details</h3>
        <p className="text-gray-600">{employee.fullName} • {employee.employeeId}</p>
      </div>

      <div className="space-y-4 p-6">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-medium text-gray-900">Basic Salary</h4>
            <p className="font-bold text-gray-900 text-2xl">
              Rs{current?.basicSalary?.toLocaleString() || "—"}
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-gray-900">Net Salary</h4>
            <p className="font-bold text-green-600 text-2xl">
              Rs{current?.netSalary?.toLocaleString() || "—"}
            </p>
          </div>
        </div>

        {current && (
          <>
            <div>
              <h4 className="mb-2 font-medium text-gray-900">Allowances</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(current.allowances).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}</span>
                    <span>Rs.{value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-gray-900">Deductions</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(current.deductions).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}</span>
                    <span>Rs.{value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}