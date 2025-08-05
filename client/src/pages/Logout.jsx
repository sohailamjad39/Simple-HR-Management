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
    navigate(-1); // Go back
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/90 shadow-2xl backdrop-blur-lg border border-black/10 rounded-3xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="p-8 text-center">
          <h2 className="mb-3 font-semibold text-gray-900 text-xl">Confirm Logout</h2>
          <p className="mb-6 text-gray-600">
            Are you sure you want to log out of your account? You'll need to sign in again to access your dashboard.
          </p>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg font-medium text-gray-700 text-sm transition-all"
            >
              No, Stay
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg font-medium text-white text-sm transition-all"
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