// client/src/components/Settings/DepartmentManager.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import SuccessToast from "../SuccessToast";
import ErrorToast from "../ErrorToast";
import ConfirmModal from "../ConfirmModal"; // Reusable confirmation

const DEPARTMENTS_CACHE_KEY = "settings_departments_cache";
const DESIGNATIONS_CACHE_KEY = "settings_designations_cache";

export default function DepartmentManager() {
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem(DEPARTMENTS_CACHE_KEY);
    if (saved) {
      try {
        const { data } = JSON.parse(saved);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.warn("Failed to parse cached departments", e);
      }
    }
    return [];
  });

  const [designations, setDesignations] = useState(() => {
    const saved = localStorage.getItem(DESIGNATIONS_CACHE_KEY);
    if (saved) {
      try {
        const { data } = JSON.parse(saved);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.warn("Failed to parse cached designations", e);
      }
    }
    return [];
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // ✅ Fetch fresh data in background
  const fetchFreshData = async () => {
    try {
      const [deptRes, desigRes] = await Promise.all([
        api.get("/settings/departments"),
        api.get("/settings/designations"),
      ]);

      const deptData = Array.isArray(deptRes.data.data) ? deptRes.data.data : [];
      const desigData = Array.isArray(desigRes.data.data) ? desigRes.data.data : [];

      setDepartments(deptData);
      setDesignations(desigData);

      localStorage.setItem(DEPARTMENTS_CACHE_KEY, JSON.stringify({ data: deptData }));
      localStorage.setItem(DESIGNATIONS_CACHE_KEY, JSON.stringify({ data: desigData }));
    } catch (err) {
      console.error("Failed to load settings", err);
    }
  };

  // ✅ Load cached data on mount, then fetch fresh
  useEffect(() => {
    // Use cached data instantly
    fetchFreshData();
  }, []);

  // ✅ Listen for global updates (e.g., from other settings)
  useEffect(() => {
    const handleRefresh = () => {
      fetchFreshData();
    };

    window.addEventListener("data-updated", handleRefresh);
    return () => {
      window.removeEventListener("data-updated", handleRefresh);
    };
  }, []);

  const handleSuccess = (msg) => {
    setMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // ✅ Notify global system
    window.dispatchEvent(new Event("data-updated"));
  };

  const handleError = (msg) => {
    setShowError(msg);
    setTimeout(() => setShowError(""), 5000);
  };

  const handleDelete = (id, type, name) => {
    setConfirmAction({ id, type, name });
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!confirmAction) return;

    const { id, type, name } = confirmAction;
    try {
      await api.delete(`/settings/${type}s/${id}`);
      if (type === "department") {
        setDepartments((prev) => prev.filter((d) => d._id !== id));
      } else {
        setDesignations((prev) => prev.filter((d) => d._id !== id));
      }
      handleSuccess(`${name} deleted successfully!`);
    } catch (err) {
      handleError("Failed to delete");
    } finally {
      setConfirmOpen(false);
      setConfirmAction(null);
    }
  };

  return (
    <>
      {/* ✅ Success & Error Toasts */}
      {showSuccess && (
        <SuccessToast message={message} onClose={() => setShowSuccess(false)} />
      )}
      {showError && (
        <ErrorToast message={showError} onClose={() => setShowError("")} />
      )}
      {confirmOpen && (
        <ConfirmModal
          isOpen={true}
          message={`Are you sure you want to delete "${confirmAction.name}"? This action cannot be undone.`}
          onConfirm={executeDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

      <div className="space-y-8">
        <Section
          title="Departments"
          items={departments}
          type="department"
          onUpdate={setDepartments}
          onSuccess={handleSuccess}
          onError={handleError}
          onDelete={handleDelete}
        />
        <Section
          title="Designations"
          items={designations}
          type="designation"
          onUpdate={setDesignations}
          onSuccess={handleSuccess}
          onError={handleError}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

function Section({
  title,
  items,
  type,
  onUpdate,
  onSuccess,
  onError,
  onDelete,
}) {
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await api.put(`/settings/${type}s/${editId}`, {
          [type === "department" ? "name" : "title"]: editName,
        });

        onUpdate((prev) =>
          prev.map((i) => (i._id === editId ? res.data.data : i))
        );
        setEditId(null);
        onSuccess(`${title.slice(0, -1)} updated successfully!`);
      } else {
        const payload = {
          [type === "department" ? "name" : "title"]: name,
        };
        if (type === "designation") {
          payload.department = null;
          payload.level = "Mid";
        }

        const res = await api.post(`/settings/${type}s`, payload);
        onUpdate((prev) => [...prev, res.data.data]);
        setName("");
        onSuccess(`${title.slice(0, -1)} added successfully!`);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || `Failed to save ${type}`;
      onError(errorMsg);
    }
  };

  const validItems = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <div className="bg-white/70 border border-gray-100 rounded-2xl overflow-hidden">
      <div className="p-6 border-gray-200 border-b">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <input
            type="text"
            value={editId ? editName : name}
            onChange={(e) =>
              editId
                ? setEditName(e.target.value)
                : setName(e.target.value)
            }
            placeholder={`New ${type} name`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 px-4 py-2 rounded-lg text-white"
          >
            {editId ? "Update" : "Add"}
          </button>
        </form>

        {validItems.length === 0 ? (
          <p className="py-4 text-gray-500 text-sm text-center">
            No {title.toLowerCase()} yet
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">
                  Name
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {validItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">
                    {item.name || item.title}
                  </td>
                  <td className="space-x-2 px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setEditId(item._id);
                        setEditName(item.name || item.title);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        onDelete(item._id, type, item.name || item.title)
                      }
                      className="text-red-600 hover:text-red-800"
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
  );
}