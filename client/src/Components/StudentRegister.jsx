import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthShell, { inputClass } from "./AuthShell";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Only allow redirects to pages inside this site
const safeRedirect = (value) =>
  value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/student-apply";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
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
      const response = await fetch(`${API}/student-register`, {
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
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server connection error");
    }

    setLoading(false);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a minute, then you can apply for any track."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={`/student-login?redirect=${encodeURIComponent(redirect)}`}
            className="font-bold text-forge-600 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={form.fullName}
          onChange={handleChange}
          required
          className={inputClass}
        />
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
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </AuthShell>
  );
};

export default StudentRegister;
