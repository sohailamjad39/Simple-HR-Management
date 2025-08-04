// client/src/utils/exportReport.js

/**
 * Export monthly attendance report as CSV
 * @param {Array} data - Monthly report data
 * @param {string} month - Format: YYYY-MM (e.g., "2025-04")
 */
export const exportToCSV = (data, month) => {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = ["Employee", "Employee ID", "Month", "Year", "Basic Salary", "Total Allowances", "Total Deductions", "Net Salary"];
  
  const rows = data.map(r => [
    r.Employee,
    r["Employee ID"],
    r.Month,
    r.Year,
    r["Basic Salary"],
    r["Total Allowances"],
    r["Total Deductions"],
    r["Net Salary"]
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `payslip-preview-${month}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};