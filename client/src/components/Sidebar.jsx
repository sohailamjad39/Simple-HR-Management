// client/src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Define menu items including Dashboard
const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Employee Management", path: "/employees" },
  { name: "Leave Management", path: "/leaves" },
  { name: "Attendance Tracking", path: "/attendance" },
  { name: "Payroll Management", path: "/payroll" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if current path matches the menu item
  const isActive = (path) => {
    return path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(path);
  };

  // Detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle swipe to open
  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      const touchX = e.touches[0].clientX;
      const diff = touchX - touchStartX;

      // Swipe right to open
      if (diff > 50 && !isOpen) {
        setIsOpen(true);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Small Arrow Indicator (only on mobile) */}
      {isMobile && !isOpen && (
        <div
          className="lg:hidden left-0 z-40 fixed inset-y-0 bg-gray-300 hover:bg-gray-400 w-1 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="top-1/2 -right-3 absolute flex justify-center items-center bg-gray-500 px-1 py-2 rounded-r w-5 h-8 text-white text-xs -translate-y-1/2 transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`top-[72px] bottom-0 left-0 z-50 fixed bg-white/80 shadow-lg backdrop-blur-md border-r border-black/10 rounded-r-3xl rounded-b-3xl w-65 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen 
            ? 'translate-x-0' 
            : '-translate-x-full'
        }`}
      >
        {/* Scrollable Menu */}
        <nav className="py-4 h-full overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`
                w-[95%] mx-1 my-1 flex items-center text-left px-6 py-3
                font-medium text-sm rounded-lg
                transition-all duration-150 cursor-pointer
                hover:shadow-sm hover:bg-indigo-50 hover:text-indigo-600
                ${isActive(item.path)
                  ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm'
                  : 'text-gray-700 hover:bg-indigo-50'
                }
              `}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && isMobile && (
        <div
          className="lg:hidden z-40 fixed inset-0 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;