// client/src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 min-h-screen">
      <div className="bg-white shadow-lg p-10 rounded-2xl w-full max-w-md">
        <h2 className="font-bold text-gray-900 text-2xl">Forgot Password?</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Enter your email to receive a password reset link.
        </p>

        {message ? (
          <div className="bg-green-50 mt-6 px-4 py-3 border border-green-200 rounded-md text-green-700 text-sm">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {error && (
              <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                placeholder="you@company.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-4 py-2 rounded w-full font-medium text-white transition-colors cursor-pointer"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer" 
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}