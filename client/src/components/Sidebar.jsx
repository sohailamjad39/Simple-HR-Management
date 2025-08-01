// client/src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";

// Define menu items including Dashboard
const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Employee Management", path: "/employees" },
  { name: "Leave Management", path: "/leaves" },
  { name: "Attendance Tracking", path: "/attendance" },
  { name: "Recruitment Module", path: "/recruitment" },
  { name: "Payroll Management", path: "/payroll" },
  { name: "Document Management", path: "/documents" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current path matches the menu item
  const isActive = (path) => {
    return path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(path);
  };

  return (
    <div
      className="top-[72px] bottom-0 left-0 z-40 fixed bg-white/80 shadow-lg backdrop-blur-md border-r border-black/10 rounded-r-3xl rounded-b-3xl w-64"
      style={{ transition: "top 0.2s ease" }}
    >
      {/* Scrollable Menu */}
      <nav className="py-4 h-full overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
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
  );
};

export default Sidebar;