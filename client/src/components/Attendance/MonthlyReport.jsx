// client/src/components/Attendance/MonthlyReport.jsx
import { useState, useEffect } from "react";
import { exportToCSV } from "../../utils/exportReport";
import api from "../../services/api";

export default function MonthlyReport({ month, setMonth }) {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [year, m] = month.split("-");
      try {
        const res = await api.get("/attendance/monthly", { params: { month: m, year } });
        setReport(res.data.data.data || []);
      } catch (err) {
        alert("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [month]);

  const handleExport = () => {
    setExportLoading(true);
    // Export to CSV only
    exportToCSV(report, month);
    setExportLoading(false);
  };

  return (
    <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap justify-between items-center gap-4 p-4 border-gray-200 border-b">
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={exportLoading || report.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
        >
          {exportLoading ? "Generating..." : "Download CSV"}
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-gray-500 text-center">Loading...</div>
      ) : report.length === 0 ? (
        <div className="py-8 text-gray-500 text-center">No data available for this month</div>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Employee</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Total Days</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Present</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Late</th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Leave</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {report.map((r) => (
              <tr key={r.employee._id} className="hover:bg-gray-50/30">
                <td className="px-6 py-4 font-medium text-sm">{r.employee.fullName}</td>
                <td className="px-6 py-4 text-sm">{r.totalDays}</td>
                <td className="px-6 py-4 text-sm">{r.present}</td>
                <td className="px-6 py-4 text-sm">{r.late}</td>
                <td className="px-6 py-4 text-sm">{r.leave}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}





// // client/src/components/Attendance/MonthlyReport.jsx
// import { useState, useEffect } from "react";
// import api from "../../services/api";
// import AttendanceFilters from "./AttendanceFilters";

// export default function MonthlyReport({ month, setMonth }) {
//   const [report, setReport] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     search: "",
//     status: "",
//     isLate: "",
//   });

//   const handleReset = () => {
//     setFilters({
//       search: "",
//       status: "",
//       isLate: "",
//     });
//   };

//   useEffect(() => {
//     const fetch = async () => {
//       setLoading(true);
//       const [year, m] = month.split("-");
//       try {
//         const res = await api.get("/attendance/monthly", {
//           params: { month: m, year, ...filters },
//         });
//         setReport(res.data.data.data || []);
//       } catch (err) {
//         alert("Failed to load report");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, [month, filters]);

//   return (
//     <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
//       <div className="p-4 border-gray-200 border-b">
//         <label className="block mb-1 font-medium text-gray-700 text-sm">Month</label>
//         <input
//           type="month"
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </div>

//       <AttendanceFilters
//         filters={filters}
//         setFilters={setFilters}
//         onReset={handleReset}
//       />

//       {loading ? (
//         <div className="py-8 text-gray-500 text-center">Loading...</div>
//       ) : (
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Employee</th>
//               <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Total Days</th>
//               <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Present</th>
//               <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Late</th>
//               <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Leave</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {report.map((r) => (
//               <tr key={r.employee._id} className="hover:bg-gray-50/30">
//                 <td className="px-6 py-4 font-medium text-sm">{r.employee.fullName}</td>
//                 <td className="px-6 py-4 text-sm">{r.totalDays}</td>
//                 <td className="px-6 py-4 text-sm">{r.present}</td>
//                 <td className="px-6 py-4 text-sm">{r.late}</td>
//                 <td className="px-6 py-4 text-sm">{r.leave}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }