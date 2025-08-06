// client/src/pages/AboutDeveloper.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AboutDeveloper() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />

        <div className="mx-auto p-6 pt-20 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-bold text-gray-900 text-3xl">About the Developer</h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white text-sm transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>

          <div className="bg-white/70 shadow-lg backdrop-blur-md p-8 border border-gray-100 rounded-3xl">
            <div className="flex md:flex-row flex-col items-center gap-8">
              {/* Profile Image Placeholder */}
              <div className="flex-shrink-0">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg rounded-full w-32 h-32 font-bold text-white text-4xl">
                  S
                </div>
              </div>

              <div className="space-y-4 md:text-left text-center">
                <h2 className="font-bold text-gray-900 text-2xl">Sohail Amjad</h2>
                <p className="font-medium text-indigo-600 text-lg">Full-Stack Developer • Software Engineer</p>
                <p className="max-w-lg text-gray-600">
                  Passionate about building clean, efficient, and user-friendly web applications with modern technologies.
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <a
                    href="https://sohailstack.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium text-white text-sm transition-colors"
                  >
                    Visit Portfolio
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-gray-200 border-t">
              <h3 className="mb-6 font-semibold text-gray-900 text-xl">Skills & Expertise</h3>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>
                  <span className="text-gray-700">React & React Router</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>
                  <span className="text-gray-700">Node.js & Express</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>
                  <span className="text-gray-700">MongoDB & Mongoose</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>
                  <span className="text-gray-700">RESTful API Design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>
                  <span className="text-gray-700">Tailwind CSS & Responsive UI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>
                  <span className="text-gray-700">Git & GitHub</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-gray-200 border-t">
              <p className="text-gray-600 md:text-left text-center">
                Built with ❤️ for modern HR teams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}