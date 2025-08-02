// client/src/components/Leave/LeaveFilters.jsx
export default function LeaveFilters({ filters, setFilters }) {
  // ✅ Reset all filters to default
  const handleReset = () => {
    setFilters({
      search: "",
      leaveType: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="bg-white/70 shadow-sm backdrop-blur-sm mb-6 p-4 border border-gray-100 rounded-2xl">
      <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Name, email, ID"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        {/* Leave Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Type</label>
          <select
            value={filters.leaveType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, leaveType: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value="">All Types</option>
            {["Sick", "Casual", "Earned", "Maternity", "Paternity", "Unpaid"].map(
              (type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Status</label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">To</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg w-full text-gray-700 text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}