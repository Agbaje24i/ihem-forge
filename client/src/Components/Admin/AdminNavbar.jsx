import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  return (
    <header className="relative">
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80')",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* Content */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo / Title */}
          <div className="flex items-center gap-4">
            <img
              src="https://dummyimage.com/40x40/007bff/ffffff&text=I"
              alt="IHEM Forge"
              className="w-10 h-10 rounded-md shadow-sm"
            />
            <div>
              <Link to="/" className="text-white text-lg font-bold tracking-wide">
                IHEM <span className="text-yellow-300">Forge</span>
              </Link>
              <div className="text-xs text-gray-200">Admin Panel</div>
            </div>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/admin-dashboard" className="text-white hover:text-yellow-300">
              Dashboard
            </Link>
            <Link
              to="/admin/manage-careers"
              className="text-white hover:text-yellow-300"
            >
              Careers
            </Link>
            <Link to="/admin/manage-events" className="text-white hover:text-yellow-300">
              Events
            </Link>
            <Link to="/admin/manage-faqs" className="text-white hover:text-yellow-300">
              FAQs
            </Link>
            <Link to="/admin/messages" className="text-white hover:text-yellow-300">
              Messages
            </Link>
          </div>

          {/* Right: Logout & Mobile Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="hidden sm:inline-block bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition"
              title="Go to public site"
            >
              View Site
            </button>

            <button
              onClick={logout}
              className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-md font-semibold hover:bg-yellow-500 transition"
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((s) => !s)}
              className="md:hidden ml-2 text-white p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-3 bg-black/70 rounded-lg p-4 space-y-3">
            <Link
              to="/admin-dashboard"
              className="block text-white hover:text-yellow-300"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/manage-careers"
              className="block text-white hover:text-yellow-300"
              onClick={() => setOpen(false)}
            >
              Careers
            </Link>
            <Link
              to="/admin/manage-events"
              className="block text-white hover:text-yellow-300"
              onClick={() => setOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/admin/manage-faqs"
              className="block text-white hover:text-yellow-300"
              onClick={() => setOpen(false)}
            >
              FAQs
            </Link>
            <Link
              to="/admin/messages"
              className="block text-white hover:text-yellow-300"
              onClick={() => setOpen(false)}
            >
              Messages
            </Link>
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full bg-yellow-400 text-blue-900 py-2 rounded-md font-semibold mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
