// client/src/pages/Logout.jsx
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login", { replace: true });
  };

  const handleCancel = () => {
    // Go back to dashboard
    navigate("/", { replace: true });
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 min-h-screen font-sans">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="-top-40 -right-40 absolute bg-indigo-100 opacity-40 blur-3xl rounded-full w-96 h-96"></div>
        <div className="-bottom-40 -left-40 absolute bg-blue-100 opacity-50 blur-3xl rounded-full w-96 h-96"></div>
      </div>

      {/* Confirmation Card */}
      <div className="z-10 relative bg-white shadow-lg p-8 border border-gray-100 rounded-2xl w-full max-w-md text-center">
        <h2 className="mb-4 font-semibold text-gray-900 text-xl">
          Confirm Logout
        </h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to log out of your account? You'll need to sign in again to access your dashboard.
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium text-gray-700 text-sm transition-colors duration-150"
          >
            No, Stay
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-white text-sm transition-colors duration-150"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;