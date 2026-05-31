import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { register } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";

export default function Register() {

  const navigate = useNavigate();

  const { registerUser } =
    useAuth();

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      password: "",

      confirmPassword: "",

      acceptTerms: false,
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     HANDLE INPUTS
  ========================= */
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm({

      ...form,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      setSuccess("");

      if (
        !form.name ||
        !form.email ||
        !form.password ||
        !form.confirmPassword
      ) {

        return setError(
          "Please fill in all required fields."
        );
      }

      if (
        form.password.length < 6
      ) {

        return setError(
          "Password must be at least 6 characters."
        );
      }

      if (
        form.password !==
        form.confirmPassword
      ) {

        return setError(
          "Passwords do not match."
        );
      }

      if (
        !form.acceptTerms
      ) {

        return setError(
          "You must accept the Terms of Service."
        );
      }

      setLoading(true);

      try {

        const payload = {

          name:
            form.name,

          email:
            form.email,

          password:
            form.password,
        };

        const { data } =
          await register(payload);

        registerUser(data);

        setSuccess(
          "Account created successfully! Redirecting..."
        );

        setTimeout(() => {

          navigate("/login");

        }, 1500);

      } catch (err) {

        setError(

          err.response?.data
            ?.error ||

          "Registration failed."
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="h-screen
                 bg-[#F5F5F7]
                 flex items-center justify-center
                 relative overflow-hidden
                 px-4"
    >

      {/* BACKGROUND BLOBS */}
      <div
        className="absolute -top-20 -left-20
                   w-[300px] h-[300px]
                   bg-[#5B57A6]
                   opacity-90 blur-3xl
                   rounded-full"
      />

      <div
        className="absolute -bottom-20 -right-20
                   w-[320px] h-[320px]
                   bg-[#F78B61]
                   opacity-90 blur-3xl
                   rounded-full"
      />

      <div className="w-full max-w-[460px] z-10">

        {/* LOGO */}
        <div className="flex justify-center mb-5">

          <h1
            className="text-5xl font-bold
                       text-[#1F1654]
                       tracking-tight"
          >
            Renyou
          </h1>

        </div>

        {/* CARD */}
        <div
          className="bg-white rounded-[28px]
                     shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                     overflow-hidden
                     border border-white/40
                     backdrop-blur-sm"
        >

          {/* TOP BLOCK */}
          <div
            className="h-20
                       bg-gradient-to-b
                       from-[#F4E9DD]
                       to-[#F7F5F2]
                       relative"
          >

            <div
              className="absolute inset-0
                         bg-[radial-gradient(circle_at_top_right,rgba(247,139,97,0.15),transparent_40%)]"
            />

          </div>

          {/* CONTENT */}
          <div className="px-7 py-6">

            <h2
              className="text-3xl font-bold
                         text-center
                         text-[#0B1A2B]
                         mb-2
                         tracking-tight"
            >
              Create Account
            </h2>

            <p
              className="text-center
                         text-gray-500
                         mb-5 text-sm"
            >
              Join Renyou for personalized skincare solutions
            </p>

            {/* ERROR */}
            {error && (

              <div
                className="mb-4 rounded-xl
                           bg-red-50
                           border border-red-200
                           px-4 py-3
                           text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (

              <div
                className="mb-4 rounded-xl
                           bg-green-50
                           border border-green-200
                           px-4 py-3
                           text-sm text-green-600"
              >
                {success}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* FULL NAME */}
              <div>

                <label
                  className="block text-sm
                             font-semibold
                             text-[#2F3A4A]
                             mb-2"
                >
                  Full Name
                </label>

                <div
                  className="flex items-center
                             border border-gray-200
                             rounded-2xl
                             px-4 py-3
                             bg-[#F9FAFB]
                             transition
                             focus-within:ring-2
                             focus-within:ring-[#5B57A6]/20
                             focus-within:border-[#5B57A6]/30"
                >

                  <User
                    size={18}
                    className="text-gray-400 mr-3"
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent
                               outline-none
                               text-gray-700
                               placeholder:text-gray-400"
                  />

                </div>

              </div>

              {/* EMAIL */}
              <div>

                <label
                  className="block text-sm
                             font-semibold
                             text-[#2F3A4A]
                             mb-2"
                >
                  Email Address
                </label>

                <div
                  className="flex items-center
                             border border-gray-200
                             rounded-2xl
                             px-4 py-3
                             bg-[#F9FAFB]
                             transition
                             focus-within:ring-2
                             focus-within:ring-[#5B57A6]/20
                             focus-within:border-[#5B57A6]/30"
                >

                  <Mail
                    size={18}
                    className="text-gray-400 mr-3"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent
                               outline-none
                               text-gray-700
                               placeholder:text-gray-400"
                  />

                </div>

              </div>

              {/* PASSWORD ROW */}
              <div
                className="grid grid-cols-1
                           md:grid-cols-2 gap-4"
              >

                {/* PASSWORD */}
                <div>

                  <label
                    className="block text-sm
                               font-semibold
                               text-[#2F3A4A]
                               mb-2"
                  >
                    Password
                  </label>

                  <div
                    className="flex items-center
                               border border-gray-200
                               rounded-2xl
                               px-4 py-3
                               bg-[#F9FAFB]
                               transition
                               focus-within:ring-2
                               focus-within:ring-[#5B57A6]/20
                               focus-within:border-[#5B57A6]/30"
                  >

                    <Lock
                      size={18}
                      className="text-gray-400 mr-3"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent
                                 outline-none
                                 text-gray-700
                                 placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="text-gray-400
                                 hover:text-gray-600"
                    >
                      {showPassword
                        ? <EyeOff size={18} />
                        : <Eye size={18} />}
                    </button>

                  </div>

                </div>

                {/* CONFIRM */}
                <div>

                  <label
                    className="block text-sm
                               font-semibold
                               text-[#2F3A4A]
                               mb-2"
                  >
                    Confirm Password
                  </label>

                  <div
                    className="flex items-center
                               border border-gray-200
                               rounded-2xl
                               px-4 py-3
                               bg-[#F9FAFB]
                               transition
                               focus-within:ring-2
                               focus-within:ring-[#5B57A6]/20
                               focus-within:border-[#5B57A6]/30"
                  >

                    <Lock
                      size={18}
                      className="text-gray-400 mr-3"
                    />

                    <input
                      type={
                        showConfirm
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={
                        form.confirmPassword
                      }
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent
                                 outline-none
                                 text-gray-700
                                 placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm(
                          !showConfirm
                        )
                      }
                      className="text-gray-400
                                 hover:text-gray-600"
                    >
                      {showConfirm
                        ? <EyeOff size={18} />
                        : <Eye size={18} />}
                    </button>

                  </div>

                </div>

              </div>

              {/* TERMS */}
              <label
                className="flex items-start
                           gap-3 text-sm
                           text-gray-500
                           cursor-pointer"
              >

                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 rounded
                             border-gray-300
                             text-[#5B57A6]
                             focus:ring-[#5B57A6]"
                />

                <span>

                  I agree to the{" "}

                  <span className="text-[#5B57A6] font-medium">
                    Terms of Service
                  </span>

                  {" "}and{" "}

                  <span className="text-[#5B57A6] font-medium">
                    Privacy Policy
                  </span>

                  .

                </span>

              </label>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full
                           bg-[#F78B61]
                           hover:bg-[#f57c4f]
                           text-white
                           py-3.5
                           rounded-2xl
                           font-semibold
                           shadow-[0_10px_30px_rgba(247,139,97,0.25)]
                           transition-all duration-300
                           hover:scale-[1.01]
                           disabled:opacity-70"
              >

                {loading
                  ? "Creating Account..."
                  : "Create Account →"}

              </button>

            </form>

            {/* FOOTER LINK */}
            <div
              className="border-t border-gray-100
                         mt-5 pt-4
                         text-center text-gray-500"
            >

              Already have an account?{" "}

              <button
                onClick={() =>
                  navigate("/login")
                }
                className="text-[#5B57A6]
                           font-semibold
                           hover:underline"
              >
                Login
              </button>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <p
          className="text-center text-xs
                     text-gray-400 mt-3"
        >
          © 2024 Renyou Parapharmacy Solutions.
          All rights reserved.
        </p>

      </div>

    </div>
  );
}