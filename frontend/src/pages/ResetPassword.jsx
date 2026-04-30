import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/api/auth.api";
import logo from "@/asset/icons/logo.svg";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    setError("");
    try {
      await resetPassword(token, { password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-[#5B57A6] blur-3xl opacity-80 rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-[#F78B61] blur-3xl opacity-80 rounded-full" />

      <div className="w-full max-w-md z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-8">
          <img src={logo} alt="Renyou" className="h-12 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Your Password</h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Please enter and confirm your new password below.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              Password reset! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#f9fafb]">
                <input
                  type={show.password ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full bg-transparent outline-none text-sm"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShow({ ...show, password: !show.password })}>
                  {show.password ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#f9fafb]">
                <input
                  type={show.confirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="w-full bg-transparent outline-none text-sm"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShow({ ...show, confirm: !show.confirm })}>
                  {show.confirm ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#F78B61] text-white py-3 rounded-xl font-semibold hover:bg-[#f57c4f] transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-4 text-center">
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