import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHome from "./DashboardHome";
import CertificateManager from "./CertificateManager";
import Students from "./Students";
import Courses from "./Courses";
import Applications from "./Applications";
import Messages from "./Messages";
import Events from "./Events";
import CareerApplications from "./CareerApplications";
import Cohorts from "./Cohorts";
import { API, adminRequest } from "../../api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("dashboard");

  const [certificates, setCertificates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      const certRes = await fetch(`${API}/certificates`);
      if (certRes.ok) {
        setCertificates(await certRes.json());
      }

      const appRes = await adminRequest("/apply");
      if (appRes.ok && Array.isArray(appRes.data)) {
        setApplications(appRes.data);
      }

      const msgRes = await adminRequest("/contact");
      if (msgRes.ok && Array.isArray(msgRes.data)) {
        setMessages(msgRes.data);
      }

      try {
        const eventRes = await fetch(`${API}/register-event`);
        if (eventRes.ok) {
          setEvents(await eventRes.json());
        }
      } catch {}

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-3xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}

      <div className="w-72 bg-slate-900 text-white">

        <div className="p-6 border-b border-slate-700">

          <h1 className="text-3xl font-bold text-yellow-400">
            IHEM FORGE
          </h1>

          <p className="text-gray-300">
            Admin Control Panel
          </p>

        </div>

        <div className="p-6 space-y-2">

          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "dashboard"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setActivePage("certificates")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "certificates"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            🏆 Certificates
          </button>

          <button
            onClick={() => setActivePage("students")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "students"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            👨‍🎓 Students
          </button>

          <button
            onClick={() => setActivePage("courses")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "courses"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            📚 Courses
          </button>

          <button
            onClick={() => setActivePage("cohorts")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "cohorts"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            📅 Cohorts &amp; Classes
          </button>

          <button
            onClick={() => setActivePage("applications")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "applications"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            📝 Applications
          </button>

          <button
            onClick={() => setActivePage("careerApplications")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "careerApplications"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            💼 Career Applications
          </button>

          <button
            onClick={() => setActivePage("messages")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "messages"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            💬 Messages
          </button>

          <button
            onClick={() => setActivePage("events")}
            className={`w-full text-left px-3 py-3 rounded ${
              activePage === "events"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            🎉 Events
          </button>

          <button
            onClick={logout}
            className="mt-8 bg-red-600 hover:bg-red-700 w-full py-3 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

      {/* Main Content */}

      <div className="flex-1 p-8">

        {activePage === "dashboard" && (
          <DashboardHome />
        )}

        {activePage === "certificates" && (
          <CertificateManager />
        )}

        {activePage === "students" && (
          <Students />
        )}

        {activePage === "courses" && (
          <Courses />
        )}

        {activePage === "cohorts" && (
          <Cohorts />
        )}

        {activePage === "applications" && (
          <Applications />
        )}

        {activePage === "careerApplications" && (
          <CareerApplications />
        )}

        {activePage === "messages" && (
          <Messages />
        )}

        {activePage === "events" && (
          <Events />
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;
