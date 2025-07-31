// client/src/components/Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Get user from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Extract initials
  const getInitials = () => {
    if (!user?.fullName) return "??";
  
    const cleanName = user.fullName.trim();
    if (cleanName.length === 0) return "??";
  
    const names = cleanName.split(/\s+/).filter(Boolean);
    if (names.length === 0) return "??";
  
    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
  
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    navigate("/logout");
  };

  // Don't render if not logged in
  if (!user) return null;

  return (
    <nav
      className="top-3 left-1/2 z-50 fixed bg-black/5 hover:bg-black/8 shadow-lg hover:shadow-xl backdrop-blur-xl hover:backdrop-blur-2xl border border-black/10 rounded-3xl focus-within:ring-2 focus-within:ring-indigo-300 w-[90%] max-w-6xl transition-all -translate-x-1/2 duration-300 transform"
      style={{ height: "68px" }}
    >
      <div className="flex justify-between items-center px-7 h-full text-gray-800">
        {/* Logo */}
        <div
          className="hover:opacity-90 font-semibold text-2xl tracking-tight transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-indigo-600">HR</span>
          <span className="font-light text-gray-700">Flow</span>
        </div>

        {/* Right Side: User Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-white/40 hover:bg-white/60 shadow-sm hover:shadow-md backdrop-blur-md px-4 py-2.5 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-200 font-medium text-sm hover:scale-105 active:scale-100 transition-all duration-200"
            aria-label="User menu"
          >
            <span className="flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm rounded-full w-9 h-9 font-bold text-white text-sm">
              {getInitials()}
            </span>
            <span className="font-medium text-gray-800">{user.fullName}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="right-0 z-50 absolute bg-white/95 shadow-2xl backdrop-blur-sm mt-3 border border-gray-200/70 rounded-2xl w-52 overflow-hidden animate-fadeIn"
              onClick={() => setDropdownOpen(false)}
            >
              <ul className="text-gray-700 text-sm">
                {[
                  { label: "Profile", route: "/profile" },
                  { label: "Settings", route: "/settings" },
                  { label: "Routes", route: "/routes" },
                ].map((item) => (
                  <li key={item.route}>
                    <button
                      onClick={() => navigate(item.route)}
                      className="hover:bg-indigo-50 px-5 py-3 w-full font-medium hover:text-indigo-600 text-sm text-left transition-all duration-150"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:bg-red-50 px-5 py-3 border-gray-200/70 border-t w-full font-medium text-red-600 text-sm text-left transition-all duration-150"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {dropdownOpen && (
        <div
          className="z-40 fixed inset-0"
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;