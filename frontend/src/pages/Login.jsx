import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";
import { Mail, Lock, Eye, EyeOff, CircleHelp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await login({
        email: form.email,
        password: form.password,
      });

      loginUser(data);

      navigate("/shop");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center relative overflow-hidden px-4">

      {/* Background */}
      <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-[#5B57A6] blur-3xl opacity-80 rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-[#F78B61] blur-3xl opacity-80 rounded-full"></div>

      <div className="w-full max-w-md z-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-[#1F1654]">Renyou</h1>
          <p className="text-sm text-gray-500 mt-1">new beginnings</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-9">

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-6 text-sm">
            Please enter your credentials to access your account
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#f9fafb]">
                <Mail size={18} className="text-gray-400 mr-3" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@parapharmacy.com"
                  className="w-full bg-transparent outline-none"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#f9fafb]">
                <Lock size={18} className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-[#5B57A6] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Buttons */}
            <div className="space-y-3">

              {/* Sign In */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F78B61] text-white py-3 rounded-xl font-semibold hover:bg-[#f57c4f] transition"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* Create Account */}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Create Account
              </button>

            </div>

          </form>

          {/* Footer */}
          <div className="flex justify-center gap-6 mt-8 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-700">
              <CircleHelp size={16} />
              Support
            </button>
            <button className="hover:text-gray-700">
              Privacy Policy
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}