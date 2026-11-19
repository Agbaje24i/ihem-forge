import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthShell, { inputClass } from "./AuthShell";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Only allow redirects to pages inside this site
const safeRedirect = (value) =>
  value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/student-portal";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("studentInfo", JSON.stringify(data.student));
        navigate(redirect);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server connection error");
    }

    setLoading(false);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your application."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to={`/student-register?redirect=${encodeURIComponent(redirect)}`}
            className="font-bold text-forge-600 hover:underline"
          >
            Register
          </Link>
        </>
      }
    >
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
};

export default StudentLogin;
