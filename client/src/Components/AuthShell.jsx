import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Logo from "./Logo";

// Two-column layout shared by the student login and register pages.
const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-gradient-to-b from-forge-50 to-white pt-24">
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
      {/* Left: pitch */}
      <div className="hidden lg:block">
        <Logo size={52} />
        <h2 className="mt-8 text-4xl font-extrabold leading-tight">
          Your tech career starts with one application.
        </h2>
        <ul className="mt-8 space-y-4 text-slate-700">
          {[
            "Choose from every major tech track",
            "Learn online, in-person or hybrid",
            "Mentorship, projects and career support",
            "A certificate employers can verify",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <CheckCircle2 className="text-forge-500" size={20} />
              {item}
            </li>
          ))}
        </ul>
        <Link
          to="/tracks"
          className="mt-8 inline-block font-bold text-forge-600 hover:text-forge-800"
        >
          Browse all tracks →
        </Link>
      </div>

      {/* Right: form card */}
      <div className="mx-auto w-full max-w-md rounded-3xl border border-forge-100 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>}
      </div>
    </div>
  </div>
);

export const inputClass =
  "w-full rounded-xl border border-forge-100 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-forge-400 focus:ring-2 focus:ring-forge-200";

export default AuthShell;
