// client/src/pages/Logout.jsx
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    // Full overlay — invisible except modal
    <div className="z-50 fixed inset-0 flex justify-center items-center p-4">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      {/* Floating Glassmorphic Card */}
      <div className="relative bg-white/90 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="p-8 text-center">
          <h2 className="mb-3 font-semibold text-gray-900 text-xl">
            Confirm Logout
          </h2>
          <p className="mb-6 text-gray-600 text-sm leading-relaxed">
            Are you sure you want to log out of your account? You'll need to sign in again to access your dashboard.
          </p>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium text-gray-700 text-sm transition-all duration-150"
            >
              No, Stay
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-white text-sm transition-all duration-150"
            >
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;