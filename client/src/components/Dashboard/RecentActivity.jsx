// client/src/components/Dashboard/RecentActivity.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        if (res.data.success && Array.isArray(res.data.data.recentActivity)) {
          setActivities(res.data.data.recentActivity);
        }
      } catch (err) {
        console.error("Failed to load recent activity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchActivity();
    };

    window.addEventListener("refresh-dashboard", handleRefresh);
    return () => {
      window.removeEventListener("refresh-dashboard", handleRefresh);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
        <h3 className="mb-4 font-semibold text-gray-900 text-lg">Recent Activity</h3>
        <p className="text-gray-500 text-sm">Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 shadow-sm backdrop-blur-sm p-6 border border-gray-100 rounded-2xl">
      <h3 className="mb-4 font-semibold text-gray-900 text-lg">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((act, index) => (
            <div key={index} className="flex justify-between items-center text-gray-700 text-sm">
              <div>
                <p>{act.action}</p>
                <p className="text-gray-500">{act.user}</p>
              </div>
              <span className="text-gray-400 text-right" style={{ minWidth: "70px" }}>
                {act.time}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}