// src/pages/Register.jsx
import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate registration logic
      setTimeout(() => {
        alert("🎉 Registered successfully!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md space-y-6 border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-700">Create Your Account</h2>
        <p className="text-center text-sm text-gray-500">Join us and book appointments with ease ✨</p>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white text-sm font-semibold rounded-xl transition ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Processing..." : "🚀 Register"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-purple-600 hover:underline">Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
