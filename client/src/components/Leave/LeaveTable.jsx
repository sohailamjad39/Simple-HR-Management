// client/src/components/Leave/LeaveTable.jsx
export default function LeaveTable({ leaves, loading, onEdit, onDelete }) {
  if (loading)
    return <div className="py-8 text-gray-500 text-center">Loading...</div>;
  if (leaves.length === 0)
    return (
      <div className="py-8 text-gray-500 text-center">No leaves found.</div>
    );

  return (
    <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">
              Employee
            </th>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">
              Type
            </th>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">
              Dates
            </th>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">
              Status
            </th>
            <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leaves.map((leave) => (
            <tr key={leave._id} className="hover:bg-gray-50/30">
              <td className="px-6 py-4 font-medium text-sm">
                {leave.employee?.fullName}
              </td>
              <td className="px-6 py-4 text-sm">{leave.leaveType}</td>
              <td className="px-6 py-4 text-gray-700 text-sm">
                {new Date(leave.startDate).toLocaleDateString()} –{" "}
                {new Date(leave.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    leave.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : leave.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : leave.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {leave.status}
                </span>
              </td>
              <td className="space-x-2 px-6 py-4 text-sm">
                <button
                  onClick={() => onEdit(leave)}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    onDelete(
                      leave._id,
                      leave.employee?.fullName || "this employee"
                    )
                  }
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
