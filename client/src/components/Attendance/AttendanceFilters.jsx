// client/src/components/Attendance/AttendanceFilters.jsx
export default function AttendanceFilters({ filters, setFilters, onReset }) {
  const safeFilters = {
    search: filters.search ?? "",
    status: filters.status ?? "",
    isLate: filters.isLate ?? "",
  };

  return (
    <div className="bg-white/70 shadow-sm backdrop-blur-sm mb-6 p-4 border border-gray-100 rounded-2xl">
      <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"> {/* Updated grid */}
        
        {/* Search */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Search</label>
          <input
            type="text"
            value={safeFilters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Name, ID, department"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Status</label>
          <select
            value={safeFilters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
            <option value="Half-Day">Half-Day</option>
          </select>
        </div>

        {/* Is Late */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Late</label>
          <select
            value={safeFilters.isLate}
            onChange={(e) => setFilters(prev => ({ ...prev, isLate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg w-full text-gray-700 text-sm transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}