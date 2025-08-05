// client/src/pages/AddEmployee.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

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
    salary: "",
    bankAccount: "",
    taxId: "",
    employmentType: "Full-Time",
    status: "Active",
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments and designations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, desigRes] = await Promise.all([
          api.get("/settings/departments"),
          api.get("/settings/designations"),
        ]);
        setDepartments(Array.isArray(deptRes.data.data) ? deptRes.data.data : []);
        setDesignations(Array.isArray(desigRes.data.data) ? desigRes.data.data : []);
      } catch (err) {
        console.error("Failed to load departments or designations", err);
      }
    };
    fetchData();
  }, []);

  // Fetch employee data if editing
  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        try {
          const res = await api.get(`/employees/${id}`);
          const emp = res.data.data;
          setFormData({
            fullName: emp.fullName || "",
            email: emp.email || "",
            phone: emp.phone || "",
            employeeId: emp.employeeId || "",
            department: emp.department || "",
            designation: emp.designation || "",
            joiningDate: emp.joiningDate?.split("T")[0] || "",
            dateOfBirth: emp.dateOfBirth?.split("T")[0] || "",
            gender: emp.gender || "",
            address: {
              street: emp.address?.street || "",
              city: emp.address?.city || "",
              state: emp.address?.state || "",
              postalCode: emp.address?.postalCode || "",
              country: emp.address?.country || "",
            },
            emergencyContact: {
              name: emp.emergencyContact?.name || "",
              phone: emp.emergencyContact?.phone || "",
              relationship: emp.emergencyContact?.relationship || "",
            },
            salary: emp.salary?.total || "",
            bankAccount: emp.bankAccount || "",
            taxId: emp.taxId || "",
            employmentType: emp.employmentType || "Full-Time",
            status: emp.status || "Active",
          });
        } catch (err) {
          setError("Failed to load employee data");
        }
      };
      fetchEmployee();
    }
  }, [id, isEdit]);

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
      const payload = {
        ...formData,
        salary: { total: formData.salary ? Number(formData.salary) : 0 },
      };

      if (isEdit) {
        await api.put(`/employees/${id}`, payload);
      } else {
        await api.post("/employees", payload);
      }
      window.dispatchEvent(new Event("data-updated"));
      navigate("/employees");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />
        <div className="mx-auto p-6 pt-20 max-w-4xl">
          <h1 className="mb-6 font-bold text-gray-900 text-2xl">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </h1>
          {error && (
            <div className="bg-red-50 mb-6 p-4 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-2xl">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">Personal Information</h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    placeholder="+1 234 567 890"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    placeholder="EMP001"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Gender</label>
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
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-2xl">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">Job Information</h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Designation *</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations
                      .filter((d) => !formData.department || d.department?.name === formData.department)
                      .map((desig) => (
                        <option key={desig._id} value={desig.title}>
                          {desig.title} {desig.level ? `(${desig.level})` : ""}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Joining Date *</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Employment Type</label>
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
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-2xl">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">Address</h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Street</label>
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
                  <label className="block mb-2 font-medium text-gray-700 text-sm">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    placeholder="Cityville"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    placeholder="California"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Postal Code</label>
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
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Country</label>
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
            <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-2xl">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">Emergency Contact</h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Name</label>
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
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Phone</label>
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
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Relationship</label>
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

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/employees")}
                className="hover:bg-gray-50 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-6 py-2 rounded-lg text-white transition-colors cursor-pointer"
              >
                {loading ? "Saving..." : isEdit ? "Update Employee" : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;