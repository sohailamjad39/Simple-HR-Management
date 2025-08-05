// client/src/components/Settings/SecuritySettings.jsx
import { useState } from "react";
import api from "../../services/api";

export default function SecuritySettings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Simulated user data
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;
    if (newPassword !== confirmNewPassword) {
      return setError("New passwords do not match");
    }
  
    setLoading(true);
    try {
      const res = await api.post("/settings/change-password", {
        currentPassword,
        newPassword,
      });
  
      setSuccess(res.data.message);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="bg-white/70 border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-6 border-gray-200 border-b">
          <h3 className="font-semibold text-gray-900 text-lg">Change Password</h3>
          <p className="text-gray-600 text-sm">Update your account password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="bg-red-50 px-3 py-2 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 px-3 py-2 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              minLength="6"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Login Info */}
      <div className="bg-white/70 border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-6 border-gray-200 border-b">
          <h3 className="font-semibold text-gray-900 text-lg">Login Information</h3>
        </div>

        <div className="space-y-3 p-6">
          <Detail label="Last Login" value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"} />
          <Detail label="Current Session" value="Active on Chrome, Windows" />
          <Detail label="Account Created" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700 text-sm">{label}</label>
      <p className="text-gray-900 text-sm">{value}</p>
    </div>
  );
}