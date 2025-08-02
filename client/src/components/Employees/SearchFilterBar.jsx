// client/src/components/Employees/SearchFilterBar.jsx
export default function SearchFilterBar({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
  sortBy,
  setSortBy,
  departments,
}) {
  return (
    <div className="bg-white/70 shadow-sm backdrop-blur-sm mb-6 p-4 border border-gray-100 rounded-2xl">
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, phone, ID"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value="fullName">Name</option>
            <option value="department">Department</option>
            <option value="joiningDate">Joining Date</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearch("");
              setDepartment("");
              setStatus("");
              setSortBy("fullName");
            }}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg w-full text-gray-700 text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}