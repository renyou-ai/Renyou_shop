import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import { register } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";
export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    skinType: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("Please fill in all required fields.");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!form.acceptTerms) {
      return setError("You must accept the Terms of Service.");
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      // Optional skin profile if selected
      if (form.skinType) {
        payload.skinProfile = {
          type: form.skinType,
          concerns: [],
          goals: [],
        };
      }

      const { data } = await register(payload);

      registerUser(data);

      console.log("Register success:", data);

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center relative overflow-hidden px-4 py-10">
      
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#5B57A6] opacity-90 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-20 -right-20 w-[320px] h-[320px] bg-[#F78B61] opacity-90 blur-3xl rounded-full"></div>

      <div className="w-full max-w-[500px] z-10">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <h1 className="text-5xl font-bold text-[#1F1654] tracking-tight">
            Renyou
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Top image placeholder block */}
          <div className="h-28 bg-gradient-to-b from-[#F4E9DD] to-[#F7F5F2]"></div>

          <div className="px-8 py-8">
            <h2 className="text-3xl font-bold text-center text-[#0B1A2B] mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Join Renyou for personalized skincare solutions
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2F3A4A] mb-2">
                  Full Name
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#F9FAFB]">
                  <User size={18} className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#2F3A4A] mb-2">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#F9FAFB]">
                  <Mail size={18} className="text-gray-400 mr-3" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#2F3A4A] mb-2">
                    Password
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#F9FAFB]">
                    <Lock size={18} className="text-gray-400 mr-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#2F3A4A] mb-2">
                    Confirm Password
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#F9FAFB]">
                    <Lock size={18} className="text-gray-400 mr-3" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-semibold text-[#2F3A4A]">
                    Tell us about your skin
                  </p>
                  <span className="text-[10px] px-2 py-1 rounded-md bg-gray-100 text-gray-500 font-medium uppercase">
                    Optional
                  </span>
                </div>

                <div className="relative">
                  <select
                    name="skinType"
                    value={form.skinType}
                    onChange={handleChange}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 bg-[#F9FAFB] text-gray-700 outline-none"
                  >
                    <option value="">Select your skin type</option>
                    <option value="oily">Oily</option>
                    <option value="dry">Dry</option>
                    <option value="combination">Combination</option>
                    <option value="sensitive">Sensitive</option>
                    <option value="normal">Normal</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-gray-300 text-[#5B57A6] focus:ring-[#5B57A6]"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-[#5B57A6] font-medium">Terms of Service</span>{" "}
                  and{" "}
                  <span className="text-[#5B57A6] font-medium">Privacy Policy</span>.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F78B61] hover:bg-[#f57c4f] text-white py-3.5 rounded-xl font-semibold shadow-md transition disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
            </form>

            {/* Bottom link */}
            <div className="border-t border-gray-100 mt-8 pt-6 text-center text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#5B57A6] font-semibold hover:underline"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © 2024 Renyou Parapharmacy Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}