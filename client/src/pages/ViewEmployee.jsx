// client/src/pages/ViewEmployee.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ViewEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load employee details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
          <Sidebar />
          <div className="mx-auto p-6 pt-20 max-w-4xl">
            <div className="text-gray-500 text-center">Loading employee...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
          <Sidebar />
          <div className="mx-auto p-6 pt-20 max-w-4xl">
            <div className="bg-red-50 p-4 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
              <button
                onClick={() => navigate(-1)}
                className="block mx-auto mt-3 underline"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />

        <div className="mx-auto p-6 pt-20 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl">Employee Details</h1>
            <div className="space-x-3">
              <button
                onClick={() => navigate(`/employees/${id}/edit`)}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => navigate("/employees")}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium text-gray-700 transition-colors"
              >
                Back
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 mb-6 px-4 py-3 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">Personal Information</h2>
              <div className="gap-5 grid grid-cols-1 md:grid-cols-2 text-sm">
                <div>
                  <label className="text-gray-600">Full Name</label>
                  <p className="font-medium">{employee.fullName}</p>
                </div>
                <div>
                  <label className="text-gray-600">Email</label>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <label className="text-gray-600">Phone</label>
                  <p className="font-medium">{employee.phone}</p>
                </div>
                <div>
                  <label className="text-gray-600">Employee ID</label>
                  <p className="font-medium">{employee.employeeId}</p>
                </div>
                <div>
                  <label className="text-gray-600">Date of Birth</label>
                  <p className="font-medium">
                    {employee.dateOfBirth
                      ? new Date(employee.dateOfBirth).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <label className="text-gray-600">Gender</label>
                  <p className="font-medium">{employee.gender || "—"}</p>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">Job Information</h2>
              <div className="gap-5 grid grid-cols-1 md:grid-cols-2 text-sm">
                <div>
                  <label className="text-gray-600">Department</label>
                  <p className="font-medium">{employee.department}</p>
                </div>
                <div>
                  <label className="text-gray-600">Designation</label>
                  <p className="font-medium">{employee.designation}</p>
                </div>
                <div>
                  <label className="text-gray-600">Employment Type</label>
                  <p className="font-medium">{employee.employmentType}</p>
                </div>
                <div>
                  <label className="text-gray-600">Date of Joining</label>
                  <p className="font-medium">
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-gray-600">Status</label>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            {employee.address && (
              <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
                <h2 className="mb-4 font-semibold text-gray-900 text-lg">Address</h2>
                <div className="gap-5 grid grid-cols-1 md:grid-cols-2 text-sm">
                  <div>
                    <label className="text-gray-600">Street</label>
                    <p className="font-medium">{employee.address.street || "—"}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">City</label>
                    <p className="font-medium">{employee.address.city || "—"}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">State</label>
                    <p className="font-medium">{employee.address.state || "—"}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Postal Code</label>
                    <p className="font-medium">{employee.address.postalCode || "—"}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Country</label>
                    <p className="font-medium">{employee.address.country || "—"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {employee.emergencyContact && (
              <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
                <h2 className="mb-4 font-semibold text-gray-900 text-lg">Emergency Contact</h2>
                <div className="gap-5 grid grid-cols-1 md:grid-cols-3 text-sm">
                  <div>
                    <label className="text-gray-600">Name</label>
                    <p className="font-medium">{employee.emergencyContact.name || "—"}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Phone</label>
                    <p className="font-medium">{employee.emergencyContact.phone || "—"}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Relationship</label>
                    <p className="font-medium">{employee.emergencyContact.relationship || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewEmployee;