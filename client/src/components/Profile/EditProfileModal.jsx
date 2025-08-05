// client/src/components/Profile/EditProfileModal.jsx
import { useState } from "react";
import api from "../../services/api";

export default function EditProfileModal({ hr, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: hr.fullName || "",
    email: hr.email || "",
    phone: hr.phone || "",
    department: hr.department || "",
    role: hr.role || "",
    address: {
      street: hr.address?.street || "",
      city: hr.address?.city || "",
      state: hr.address?.state || "",
      postalCode: hr.address?.postalCode || "",
      country: hr.address?.country || "",
    },
    metadata: { ...hr.metadata } || {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleMetadataChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    setLoading(true);
    try {
      const res = await api.put("/hr/profile", formData);
      const updatedHR = res.data.hr;
  
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        fullName: updatedHR.fullName,
        email: updatedHR.email,
        phone: updatedHR.phone,
        department: updatedHR.department,
        role: updatedHR.role,
        address: updatedHR.address,
        metadata: updatedHR.metadata,
      }));
  
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("user-updated"));

      onSuccess(updatedHR);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/90 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-lg overflow-hidden animate-fadeIn">
        <div className="p-6">
          <h2 className="mb-1 font-semibold text-gray-900 text-xl">Edit Profile</h2>
          <p className="mb-4 text-gray-600 text-sm">Update your personal and professional details</p>

          {error && (
            <div className="bg-red-50 mb-4 px-3 py-2 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pr-2 max-h-96 overflow-y-auto">
            {/* Personal Info */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                >
                  <option value="">Select Role</option>
                  <option value="HR">HR</option>
                  <option value="SuperHR">SuperHR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="pt-4 border-t">
              <h3 className="mb-3 font-medium text-gray-900">Address</h3>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.address.postalCode}
                    onChange={handleAddressChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors cursor-pointer"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}