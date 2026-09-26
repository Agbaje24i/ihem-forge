import React from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  const handleManageClick = () => {
    navigate("/admin-dashboard"); // ✅ Correct route
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 text-center text-white px-6 py-10 bg-black bg-opacity-40 rounded-2xl shadow-lg max-w-lg">
        <h1 className="text-4xl font-extrabold mb-4 tracking-wide">
          Admin Dashboard
        </h1>

        <p className="text-lg mb-2">
          Welcome to the IHEM Forge Admin Panel
        </p>

        <p className="text-gray-300 text-sm mb-6">
          Manage events, careers, FAQs, contact messages and certificates.
        </p>

        <button
          onClick={handleManageClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Manage Portal
        </button>
      </div>
    </div>
  );
};

export default Admin;