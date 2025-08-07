// client/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      const userData = res.data.data;
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 min-h-screen font-sans">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="-top-40 -right-40 absolute bg-indigo-100 opacity-40 blur-3xl rounded-full w-96 h-96"></div>
        <div className="-bottom-40 -left-40 absolute bg-blue-100 opacity-50 blur-3xl rounded-full w-96 h-96"></div>
      </div>

      <div className="z-10 relative space-y-8 bg-white shadow-lg p-10 border border-gray-100 rounded-2xl w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center">
          <h2 className="mt-2 font-bold text-gray-900 text-3xl">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Sign in to your HR dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md">
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleChange}
                className="block focus:z-10 relative px-3 py-3 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-gray-900 sm:text-sm transition-colors duration-200 appearance-none placeholder-gray-500"
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={handleChange}
                className="block focus:z-10 relative px-3 py-3 border border-gray-300 focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-gray-900 sm:text-sm transition-colors duration-200 appearance-none placeholder-gray-500"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="border-gray-300 rounded focus:ring-indigo-500 w-4 h-4 text-indigo-600"
              />
              <label htmlFor="remember-me" className="block ml-2 text-gray-700">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="button"
                className="focus:outline-none font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-4 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full font-medium text-white text-sm transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 -ml-1 w-4 h-4 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-150 cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
