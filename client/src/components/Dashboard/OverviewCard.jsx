// client/src/components/Dashboard/OverviewCard.jsx
export default function OverviewCard({ title, value, subtitle, icon }) {
    return (
      <div className="bg-white/70 shadow-sm hover:shadow-md backdrop-blur-sm p-6 border border-gray-100 rounded-2xl transition-shadow duration-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-600 text-sm">{title}</p>
            <h3 className="mt-1 font-bold text-gray-900 text-2xl">{value}</h3>
            {subtitle && <p className="mt-1 text-gray-500 text-xs">{subtitle}</p>}
          </div>
          <div className="opacity-80 text-indigo-500">{icon}</div>
        </div>
      </div>
    );
  }