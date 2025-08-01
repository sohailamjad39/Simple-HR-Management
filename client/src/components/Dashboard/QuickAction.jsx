// client/src/components/Dashboard/QuickAction.jsx
export default function QuickAction({ label, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-white/60 hover:bg-white/90 hover:shadow-sm p-3 border border-gray-100 rounded-xl font-medium text-gray-700 text-sm transition-all duration-150 cursor-pointer"
    >
      <span className="text-indigo-500">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
