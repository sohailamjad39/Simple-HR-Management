// client/src/components/Employees/EmployeeTable.jsx
export default function EmployeeTable({ employees, loading, onView, onEdit }) {
    if (loading) {
      return <div className="py-8 text-gray-500 text-center">Loading employees...</div>;
    }
  
    if (employees.length === 0) {
      return <div className="py-8 text-gray-500 text-center">No employees found.</div>;
    }
  
    return (
      <div className="bg-white/70 shadow-sm backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-gray-200 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Joining Date</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 text-sm">{emp.fullName}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{emp.email}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{emp.department}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{new Date(emp.joiningDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    emp.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="space-x-2 px-6 py-4 text-sm">
                  <button
                    onClick={() => onView(emp._id)}
                    className="text-indigo-600 hover:text-indigo-800 text-xs cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(emp._id)}
                    className="text-blue-600 hover:text-blue-800 text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }