import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { login } from "../api/auth.api";

import {
  useAuth,
} from "@/context/AuthContext";

/* 🔥 LOGO */
import logoLogin
  from "@/asset/images/logo_login.png";

export default function Login() {

  const navigate =
    useNavigate();

  const { loginUser } =
    useAuth();

  const [form, setForm] =
    useState({

      email: "",

      password: "",

      remember: false,
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

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
     LOGIN
  ========================= */
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      setLoading(true);

      try {

        const response =
          await login({

            email:
              form.email,

            password:
              form.password,
          });

        const data =
          response.data;

        loginUser(data);

        const role =
          data?.user?.role;

        if (
          role === "admin"
        ) {

          window.location.href =
            "/admin/dashboard";

        } else {

          window.location.href =
            "/home";
        }

      } catch (err) {

        setError(

          err.response?.data
            ?.message ||

          "Login failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="min-h-screen
                 bg-[#f5f5f7]
                 flex items-center
                 justify-center
                 relative overflow-hidden
                 px-4"
    >

      {/* BG TOP */}
      <div
        className="absolute
                   -top-28
                   -left-28
                   w-[340px]
                   h-[340px]
                   bg-[#5B57A6]
                   blur-3xl
                   opacity-80
                   rounded-full"
      />

      {/* BG BOTTOM */}
      <div
        className="absolute
                   -bottom-28
                   -right-28
                   w-[340px]
                   h-[340px]
                   bg-[#F78B61]
                   blur-3xl
                   opacity-80
                   rounded-full"
      />

      {/* CONTAINER */}
      <div
        className="relative z-10
                   w-full
                   max-w-[430px]"
      >

        {/* LOGO */}
        <div className="flex justify-center mb-8">

          <img
            src={logoLogin}
            alt="Renyou"
            className="w-[220px] object-contain"
          />

        </div>

        {/* CARD */}
        <div
          className="bg-white
                     rounded-2xl
                     shadow-xl
                     border border-gray-100
                     px-8 py-8"
        >

          {/* TITLE */}
          <div className="mb-6">

            <h1
              className="text-[28px]
                         font-bold
                         text-[#111827]"
            >
              Welcome Back
            </h1>

            <p
              className="text-sm
                         text-gray-400
                         mt-1"
            >
              Please enter your credentials to access your account
            </p>

          </div>

          {/* ERROR */}
          {error && (

            <div
              className="mb-5
                         bg-red-50
                         border border-red-200
                         text-red-500
                         text-sm
                         rounded-xl
                         px-4 py-3"
            >
              {error}
            </div>

          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label
                className="block
                           text-sm
                           font-medium
                           text-gray-700
                           mb-2"
              >
                Email Address
              </label>

              <div
                className="flex items-center
                           bg-[#f9fafb]
                           border border-gray-200
                           rounded-xl
                           px-4 py-3"
              >

                <Mail
                  size={18}
                  className="text-gray-400 mr-3"
                />

                <input
                  type="email"

                  name="email"

                  placeholder="admin@parapharmacy.com"

                  value={form.email}

                  onChange={handleChange}

                  className="w-full
                             bg-transparent
                             outline-none
                             text-sm"

                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div>

              <label
                className="block
                           text-sm
                           font-medium
                           text-gray-700
                           mb-2"
              >
                Password
              </label>

              <div
                className="flex items-center
                           bg-[#f9fafb]
                           border border-gray-200
                           rounded-xl
                           px-4 py-3"
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

                  className="w-full
                             bg-transparent
                             outline-none
                             text-sm"

                  required
                />

                <button
                  type="button"

                  onClick={() =>

                    setShowPassword(
                      !showPassword
                    )
                  }
                >

                  {showPassword

                    ? (
                      <EyeOff
                        size={18}
                        className="text-gray-400"
                      />
                    )

                    : (
                      <Eye
                        size={18}
                        className="text-gray-400"
                      />
                    )}

                </button>

              </div>

            </div>

            {/* OPTIONS */}
            <div
              className="flex items-center
                         justify-between
                         text-sm"
            >

              <label
                className="flex items-center
                           gap-2
                           text-gray-500"
              >

                <input
                  type="checkbox"

                  name="remember"

                  checked={
                    form.remember
                  }

                  onChange={handleChange}
                />

                Remember me

              </label>

              <button
                type="button"

                onClick={() =>
                  navigate(
                    "/forgot-password"
                  )
                }

                className="text-[#5B57A6]
                           font-medium
                           hover:underline"
              >
                Forgot password ?
              </button>

            </div>

            {/* ACTIONS */}
            <div className="space-y-3 pt-2">

              <button
                type="submit"

                disabled={loading}

                className="w-full
                           bg-[#F78B61]
                           text-white py-3
                           rounded-xl
                           font-semibold
                           hover:bg-[#f57c4f]
                           transition"
              >

                {loading
                  ? "Signing In..."
                  : "Sign In"}

              </button>

              <button
                type="button"

                onClick={() =>
                  navigate("/register")
                }

                className="w-full
                           border border-gray-200
                           text-gray-700 py-3
                           rounded-xl
                           font-medium
                           hover:bg-gray-50
                           transition"
              >
                Create Account
              </button>

            </div>

          </form>

          {/* FOOTER */}
          <div
            className="flex justify-center
                       gap-5
                       mt-8
                       text-[12px]
                       text-gray-400"
          >

            <button>
              © Technical Support
            </button>

            <button>
              © Privacy Policy
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}