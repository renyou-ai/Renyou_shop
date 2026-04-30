import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { forgotPassword } from "@/api/auth.api";
import logo from "@/asset/icons/logo.svg";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-[#5B57A6] blur-3xl opacity-80 rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-[#F78B61] blur-3xl opacity-80 rounded-full" />

        <div className="w-full max-w-md z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-8 text-center">
              <img src={logo} alt="Renyou" className="h-12 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
              <p className="text-gray-500 text-sm mb-1">We've sent a password reset link to</p>
              <p className="font-semibold text-gray-800 text-sm mb-1">{email}</p>
              <p className="text-gray-500 text-sm mb-6">. Please check your inbox and follow the instructions.</p>

              <button
                onClick={() => window.open("mailto:")}
                className="w-full bg-[#5B57A6] text-white py-3 rounded-xl font-semibold hover:bg-[#4a4690] transition flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Open Email App
              </button>

              <button
                onClick={() => setSent(false)}
                className="mt-4 text-sm text-[#5B57A6] hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                ↺ Resend link
              </button>
            </div>

            <div className="border-t border-gray-100 px-8 py-4 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-[#5B57A6] blur-3xl opacity-80 rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-[#F78B61] blur-3xl opacity-80 rounded-full" />

      <div className="w-full max-w-md z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-8">
            <img src={logo} alt="Renyou" className="h-12 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password?</h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#f9fafb]">
                  <Mail size={18} className="text-gray-400 mr-3" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent outline-none text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5B57A6] text-white py-3 rounded-xl font-semibold hover:bg-[#4a4690] transition"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>

          <div className="border-t border-gray-100 px-8 py-4 flex flex-col items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← Back to Login
            </button>
            <p className="text-xs text-gray-400">© 2024 DermAdmin Parapharmacy Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
}