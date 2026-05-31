
import { useState } from "react";

export default function AddUserModal({
  onClose,
  onSave,
}) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await onSave(form);

      onClose();

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40
                 flex items-center justify-center px-4"
    >

      <div
        className="bg-white rounded-3xl w-full
                   max-w-md shadow-xl p-6"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Add New User
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Create a customer account
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200
                         rounded-2xl px-4 py-3 text-sm
                         outline-none focus:ring-2
                         focus:ring-[#4a46a0]/20"
            />

          </div>

          <div>

            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200
                         rounded-2xl px-4 py-3 text-sm
                         outline-none focus:ring-2
                         focus:ring-[#4a46a0]/20"
            />

          </div>

          <div>

            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200
                         rounded-2xl px-4 py-3 text-sm
                         outline-none focus:ring-2
                         focus:ring-[#4a46a0]/20"
            />

          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200
                         rounded-2xl py-3 text-sm
                         font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#4a46a0]
                         hover:bg-[#3d3985]
                         text-white rounded-2xl py-3
                         text-sm font-medium transition"
            >
              {loading
                ? "Creating..."
                : "Create User"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}