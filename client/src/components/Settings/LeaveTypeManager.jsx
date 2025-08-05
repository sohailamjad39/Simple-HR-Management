// client/src/components/Settings/LeaveTypeManager.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import SuccessToast from "../SuccessToast";
import ErrorToast from "../ErrorToast";
import ConfirmModal from "../ConfirmModal";

const CACHE_KEY = "leave_types_cache";

export default function LeaveTypeManager() {
  const [types, setTypes] = useState(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data } = JSON.parse(saved);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.warn("Failed to parse cached leave types", e);
      }
    }
    return [];
  });

  const [form, setForm] = useState({ name: "", daysPerYear: 12, paid: true, carryForward: false });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchFreshData = async () => {
    try {
      const res = await api.get("/settings/leave-types");
      const data = Array.isArray(res.data.data) ? res.data.data : [];

      setTypes(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (err) {
      console.error("Failed to load leave types", err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        const { data } = JSON.parse(saved);
        if (Array.isArray(data)) {
          setTypes(data);
        }
      } catch (e) {
        console.warn("Failed to read leave types cache", e);
      }
    }

    fetchFreshData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchFreshData();
    };

    window.addEventListener("data-updated", handleRefresh);
    return () => {
      window.removeEventListener("data-updated", handleRefresh);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setShowError("Leave type name is required");
      setTimeout(() => setShowError(""), 5000);
      return;
    }

    try {
      const res = await api.post("/settings/leave-types", form);
      setTypes((prev) => [...prev, res.data.data]);
      setForm({ name: "", daysPerYear: 12, paid: true, carryForward: false });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add leave type";
      setShowError(errorMsg);
      setTimeout(() => setShowError(""), 5000);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await api.delete(`/settings/leave-types/${id}`);
      setTypes((prev) => prev.filter((t) => t._id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete leave type";
      setShowError(errorMsg);
      setTimeout(() => setShowError(""), 5000);
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <>
      {/* Success & Error Toasts */}
      {showSuccess && (
        <SuccessToast
          message="Leave type added successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorToast
          message={showError}
          onClose={() => setShowError("")}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete Leave Type"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirmDelete.id, confirmDelete.name)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="bg-white/70 border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-6 border-gray-200 border-b">
          <h3 className="font-semibold text-gray-900 text-lg">Leave Types</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="gap-4 grid grid-cols-1 md:grid-cols-5 mb-6">
            <input
              type="text"
              placeholder="e.g., Sick"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Days"
              value={form.daysPerYear}
              onChange={(e) => setForm((prev) => ({ ...prev, daysPerYear: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
              min="0"
              max="365"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.paid}
                onChange={(e) => setForm((prev) => ({ ...prev, paid: e.target.checked }))}
                className="mr-2"
              />
              Paid
            </label>
            <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-lg text-white cursor-pointer">
              Add
            </button>
          </form>

          {types.length === 0 ? (
            <p className="py-4 text-gray-500 text-sm text-center">No leave types yet</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Days</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Paid</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Carry Forward</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {types.map((t) => (
                  <tr key={t._id}>
                    <td className="px-6 py-4">{t.name}</td>
                    <td className="px-6 py-4">{t.daysPerYear}</td>
                    <td className="px-6 py-4">{t.paid ? "Yes" : "No"}</td>
                    <td className="px-6 py-4">{t.carryForward ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setConfirmDelete({ id: t._id, name: t.name })}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}