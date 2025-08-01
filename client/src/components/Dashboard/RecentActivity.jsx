// client/src/components/Dashboard/RecentActivity.jsx
const activities = [
    { id: 1, action: "New employee added", user: "John Doe", time: "2 min ago" },
    { id: 2, action: "Leave approved", user: "Alice Smith", time: "15 min ago" },
    { id: 3, action: "Interview scheduled", user: "Bob Lee", time: "1 hour ago" },
    { id: 4, action: "Job posted", user: "HR Team", time: "3 hours ago" },
  ];
  
  export default function RecentActivity() {
    return (
      <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
        <h3 className="mb-4 font-semibold text-gray-900 text-lg">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="flex justify-between items-center text-gray-700 text-sm">
              <div>
                <p>{act.action}</p>
                <p className="text-gray-500">{act.user}</p>
              </div>
              <span className="text-gray-400">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }