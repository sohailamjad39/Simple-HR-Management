// client/src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProfileView from "../components/Profile/ProfileView";
import EditProfileModal from "../components/Profile/EditProfileModal";

const Profile = () => {
  const navigate = useNavigate();
  const [hr, setHr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/hr/profile");
        setHr(res.data.hr);
      } catch (err) {
        console.error("Failed to load profile", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = (updated) => {
    setHr(updated);
    setShowEdit(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 pt-20 pl-0 lg:pl-64 min-h-screen">
          <Sidebar />
          <div className="mx-auto p-6 max-w-4xl">
            <div className="bg-white/70 shadow-sm p-8 border border-gray-100 rounded-2xl text-center">
              Loading...
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />

        <div className="mx-auto p-6 pt-20 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl">My Profile</h1>
            <button
              onClick={() => setShowEdit(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            >
              Edit Profile
            </button>
          </div>

          <ProfileView hr={hr} />

          {showEdit && (
            <EditProfileModal
              hr={hr}
              onClose={() => setShowEdit(false)}
              onSuccess={handleUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;