// client/src/pages/LeaveManagement.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LeaveFilters from "../components/Leave/LeaveFilters";
import LeaveTable from "../components/Leave/LeaveTable";
import AddLeaveModal from "../components/Leave/AddLeaveModal";
import EditLeaveModal from "../components/Leave/EditLeaveModal";
import ConfirmModal from "../components/Leave/ConfirmModal";

const LeaveManagement = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = async (id, employeeName) => {
    try {
      await api.delete(`/leaves/${id}`);
      fetchLeaves(); // Refresh list
    } catch (err) {
      alert("Failed to delete leave");
    } finally {
      setConfirmDelete(null); // Close modal
    }
  };

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    employee: "",
    leaveType: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null); 
  const [employees, setEmployees] = useState([]);

  // Fetch leaves
  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves", { params: filters });

      if (Array.isArray(res.data.leaves)) {
        setLeaves(res.data.leaves);
      } else {
        setError("Invalid data format received");
      }
    } catch (err) {
      console.error("Leave fetch error:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/login", { replace: true });
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. Check backend route.");
      } else {
        setError(err.response?.data?.message || "Failed to load leaves");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for modal
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to load employees");
      }
    };
    fetchEmployees();
  }, []);

  // Fetch leaves on mount & filter change
  useEffect(() => {
    setLoading(true);
    fetchLeaves();
  }, [filters]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />

        <div className="mx-auto p-6 pt-20 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl">
              Leave Management
            </h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            >
              + Add Leave
            </button>
          </div>

          {error && (
            <div className="bg-red-50 mb-6 px-4 py-3 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <LeaveFilters filters={filters} setFilters={setFilters} />

          <LeaveTable
            leaves={leaves}
            loading={loading}
            onEdit={(leave) => setShowEditModal(leave)}
            onDelete={(id, employeeName) =>
              setConfirmDelete({ id, employeeName })
            }
          />

          {showAddModal && (
            <AddLeaveModal
              employees={employees}
              onClose={() => setShowAddModal(false)}
              onSuccess={fetchLeaves}
            />
          )}

          {showEditModal && (
            <EditLeaveModal
              leave={showEditModal}
              employees={employees}
              onClose={() => setShowEditModal(null)}
              onSuccess={fetchLeaves}
            />
          )}
          {confirmDelete && (
            <ConfirmModal
              isOpen={true}
              title="Confirm Delete"
              message={`Are you sure you want to delete the leave for ${confirmDelete.employeeName}? This action cannot be undone.`}
              onConfirm={() =>
                handleDelete(confirmDelete.id, confirmDelete.employeeName)
              }
              onCancel={() => setConfirmDelete(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveManagement;
