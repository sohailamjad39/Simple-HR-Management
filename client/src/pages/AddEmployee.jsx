// client/src/pages/AddEmployee.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    employeeId: "",
    department: "",
    designation: "",
    joiningDate: "",
    dateOfBirth: "",
    gender: "",
    employmentType: "Full-Time",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { fullName, email, phone, employeeId, department, designation, joiningDate } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 2) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/employees", formData);
      // Save employee ID for toast or redirect
      navigate("/employees", { state: { added: res.data.data._id } });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pt-20 pb-10 min-h-screen">
      {/* Page Header */}
      <div className="mx-auto px-6 max-w-4xl">
        <h1 className="mb-2 font-bold text-gray-900 text-2xl">Add New Employee</h1>
        <p className="mb-8 text-gray-600">Fill in the details to onboard a new team member.</p>

        {error && (
          <div className="bg-red-50 mb-6 px-4 py-3 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
            <h2 className="mb-5 font-semibold text-gray-900 text-lg">Basic Information</h2>
            <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={employeeId}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="EMP001"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="john@company.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="+1 234 567 890"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={department}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="Engineering"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={designation}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="Software Engineer"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Joining Date *
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={joiningDate}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
            <h2 className="mb-5 font-semibold text-gray-900 text-lg">Address</h2>
            <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Street
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  State
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="10001"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Country
                </label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
            <h2 className="mb-5 font-semibold text-gray-900 text-lg">Emergency Contact</h2>
            <div className="gap-5 grid grid-cols-1 md:grid-cols-3">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Phone
                </label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Relationship
                </label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  placeholder="Spouse"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-100 hover:bg-gray-200 mr-3 px-5 py-2 rounded-lg font-medium text-gray-700 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-5 py-2 rounded-lg font-medium text-white text-sm transition-colors"
            >
              {loading ? "Saving..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;