import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @component Navbar
 * @description Floating glassmorphic navigation bar visible only to authenticated users.
 *              Displays user profile with dropdown menu for navigation and logout.
 *              Uses backdrop blur, subtle shadows, and rounded corners for modern aesthetic.
 *              Conditionally renders based on auth state to prevent hook mismatches.
 *
 * @access Protected (only renders if user is logged in)
 * @design Glassmorphism theme with indigo/purple gradient accents
 */
const Navbar = () => {
  const navigate = useNavigate();
  
  // ✅ All hooks called unconditionally at the top
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Retrieve user data from localStorage
  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Failed to parse user data from localStorage", error);
  }

  // 🔒 Conditionally return after hooks
  if (!user) return null;

  /**
   * Extracts user initials from fullName
   * @returns {string} 1-2 uppercase letters (e.g., "JD" or "S")
   */
  const getInitials = () => {
    if (!user.fullName) return "??";
    const cleanName = user.fullName.trim();
    if (cleanName.length === 0) return "??";

    const names = cleanName.split(/\s+/).filter(Boolean);
    if (names.length === 0) return "??";

    return names.length === 1
      ? names[0][0].toUpperCase()
      : `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  /**
   * Handles logout: clears auth data and redirects to login
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Close dropdown when clicking outside (only when dropdown is open and user exists)
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav
      className="top-2 left-1/2 z-50 fixed bg-black/5 hover:bg-black/8 shadow-lg hover:shadow-xl backdrop-blur-xl hover:backdrop-blur-2xl border border-black/10 rounded-3xl focus-within:ring-2 focus-within:ring-indigo-300 w-[97%] max-w-full transition-all -translate-x-1/2 duration-300 transform"
      style={{ height: "52px" }}
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center px-5 h-full text-gray-800">
        {/* Logo */}
        <div
          className="flex items-center hover:opacity-90 font-semibold text-lg tracking-normal transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/")}
          aria-label="Go to dashboard"
        >
          <span className="text-indigo-600">HR</span>
          <span className="font-light text-gray-700">Flow</span>
        </div>

        {/* User Profile Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-white/40 hover:bg-white/60 shadow-sm hover:shadow-md backdrop-blur-md px-3 py-1.5 border border-white/30 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-200 font-medium text-gray-800 text-xs hover:scale-105 active:scale-100 transition-all duration-200"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            {/* User Initials Badge */}
            <span
              className="flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm rounded-full w-7 h-7 font-bold text-white text-xs"
            >
              {getInitials()}
            </span>

            {/* Full Name */}
            <span>{user.fullName}</span>

            {/* Dropdown Indicator */}
            <svg
              className={`
                w-3.5 h-3.5 opacity-70 transition-transform duration-200
                ${dropdownOpen ? "rotate-180" : ""}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="right-0 absolute bg-white/95 shadow-2xl backdrop-blur-sm mt-2 border border-gray-200/70 rounded-2xl w-48 overflow-hidden animate-fadeIn"
              role="menu"
            >
              <ul className="text-gray-700 text-sm">
                {[
                  { label: "Profile", route: "/profile" },
                  { label: "Settings", route: "/settings" },
                  { label: "Routes", route: "/routes" },
                ].map((item, index, array) => (
                  <li key={item.route}>
                    <button
                      onClick={() => {
                        navigate(item.route);
                        setDropdownOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2.5 font-medium text-sm transition-all
                        hover:bg-indigo-50 hover:text-indigo-600
                        ${index === 0 ? 'rounded-t-2xl' : ''}
                        ${index === array.length - 1 ? 'rounded-b-2xl' : ''}
                        hover:rounded-2xl
                      `}
                      role="menuitem"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}

                {/* Logout Button */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:bg-red-50 px-4 py-2.5 border-gray-200/70 border-t hover:rounded-2xl rounded-b-2xl w-full font-medium text-red-600 text-sm text-left transition-all"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;