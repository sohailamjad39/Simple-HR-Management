// client/src/components/Dashboard/DashboardLayout.jsx
export default function DashboardLayout({ children }) {
    return (
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    );
  }