import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, LogOut } from "lucide-react";
import { inputClass } from "./AuthShell";
import { categories, getTrack, tracks } from "../data/tracks";
import { experienceLevels, learningModes } from "../data/site";
import { formatDate, naira, publicRequest } from "../api";
import { API } from "../api";


const emptyForm = (track = "") => ({
  course: track,
  learningMode: "online",
  experienceLevel: experienceLevels[0],
  phone: "",
  gender: "",
  qualification: "",
  needsSupport: false,
  supportReason: "",
  message: "",
});

const StudentApply = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [studentInfo, setStudentInfo] = useState(null);
  const [extraCourses, setExtraCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [cohorts, setCohorts] = useState([]);
  const [cohortId, setCohortId] = useState("");

  const preselected = getTrack(searchParams.get("track"))?.name || "";
  const [form, setForm] = useState(emptyForm(preselected));

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    const info = localStorage.getItem("studentInfo");

    if (!token || !info) {
      // Come back here (with the chosen track) after logging in
      const back = encodeURIComponent(location.pathname + location.search);
      navigate(`/student-login?redirect=${back}`, { replace: true });
      return;
    }

    setStudentInfo(JSON.parse(info));

    // Courses added by an admin that are not in the built-in track list
    fetch(`${API}/courses`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setExtraCourses(data.map((c) => c.courseName));
      })
      .catch((err) => console.log(err));
  }, [navigate, location.pathname, location.search]);

  const extraOnly = useMemo(() => {
    const known = new Set(tracks.map((t) => t.name.toLowerCase()));
    return extraCourses.filter((name) => name && !known.has(name.toLowerCase()));
  }, [extraCourses]);

  // Open intakes for the chosen track
  useEffect(() => {
    setCohortId("");
    setCohorts([]);
    if (!form.course) return;
    let active = true;
    publicRequest(`/cohorts?track=${encodeURIComponent(form.course)}`).then(({ ok, data }) => {
      if (active && ok && Array.isArray(data)) setCohorts(data);
    });
    return () => {
      active = false;
    };
  }, [form.course]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: studentInfo.fullName,
          email: studentInfo.email,
          phone: form.phone,
          course: form.course,
          gender: form.gender,
          qualification: form.qualification,
          learningMode: form.learningMode,
          experienceLevel: form.experienceLevel,
          supportNeeded: form.needsSupport ? form.supportReason || "Yes" : "",
          message: form.message,
          ...(cohortId ? { cohortId } : {}),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Application submitted successfully! We'll be in touch soon.");
        setForm(emptyForm());
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.message || "Failed to submit application");
      }
    } catch (err) {
      setError(`Cannot reach the server at ${API}. Check that the backend is running and its port is public.`);
    }

    setSubmitting(false);
  };

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    navigate("/student-login");
  };

  if (!studentInfo) return null;

  const label = "mb-1.5 block text-sm font-semibold text-forge-950";

  return (
    <div className="min-h-screen bg-gradient-to-b from-forge-50 to-white pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Welcome, {studentInfo.fullName}
            </h1>
            <p className="mt-2 text-slate-600">
              Choose your track and tell us a little about yourself.
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-forge-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-forge-50"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-forge-100 bg-white p-8 shadow-card">
          {success && (
            <p className="mb-5 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>
                {success}{" "}
                <Link to="/student-portal" className="font-semibold underline">
                  Open my portal
                </Link>
              </span>
            </p>
          )}
          {error && (
            <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Track */}
            <div>
              <label htmlFor="course" className={label}>Track</label>
              <select
                id="course"
                name="course"
                value={form.course}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select a track</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.label}>
                    {tracks
                      .filter((t) => t.category === cat.id)
                      .map((t) => (
                        <option key={t.slug} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
                {extraOnly.length > 0 && (
                  <optgroup label="Other courses">
                    {extraOnly.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Cohort */}
            {form.course && (
              <div>
                <label htmlFor="cohort" className={label}>Start date (cohort)</label>
                {cohorts.length === 0 ? (
                  <p className="rounded-xl bg-forge-50 p-3 text-sm text-slate-600">
                    No intake dates are open for this track yet. You can still apply and we will place you in the next one.
                  </p>
                ) : (
                  <select
                    id="cohort"
                    value={cohortId}
                    onChange={(e) => setCohortId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">No preference</option>
                    {cohorts.map((c) => (
                      <option key={c._id} value={c._id} disabled={c.seatsLeft <= 0}>
                        {c.name} · starts {formatDate(c.startDate)} · {c.mode === "any" ? "any mode" : c.mode}
                        {c.tuition ? ` · ${naira(c.tuition)}` : ""}
                        {c.seatsLeft <= 0 ? " · full" : ` · ${c.seatsLeft} seats left`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Learning mode */}
            <fieldset>
              <legend className={label}>How would you like to learn?</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {learningModes.map((m) => (
                  <label
                    key={m.id}
                    className={`cursor-pointer rounded-xl border p-3 text-sm transition ${
                      form.learningMode === m.id
                        ? "border-forge-500 bg-forge-50"
                        : "border-forge-100 hover:border-forge-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="learningMode"
                      value={m.id}
                      checked={form.learningMode === m.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="block font-bold text-forge-950">{m.label}</span>
                    <span className="mt-1 block text-xs text-slate-500">{m.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Experience */}
            <div>
              <label htmlFor="experienceLevel" className={label}>Your experience level</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className={inputClass}
              >
                {experienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className={label}>Phone number</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="gender" className={label}>Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="qualification" className={label}>Highest qualification</label>
              <input
                id="qualification"
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g. B.Sc Computer Science"
                className={inputClass}
              />
            </div>

            {/* Support */}
            <div className="rounded-xl bg-forge-50 p-4">
              <label className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-forge-950">
                <input
                  type="checkbox"
                  name="needsSupport"
                  checked={form.needsSupport}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-forge-600"
                />
                I would like to be considered for scholarship or financial support
              </label>
              {form.needsSupport && (
                <textarea
                  name="supportReason"
                  value={form.supportReason}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us briefly why tuition or equipment is a barrier for you"
                  className={`${inputClass} mt-3`}
                />
              )}
            </div>

            <div>
              <label htmlFor="message" className={label}>Anything else? (optional)</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="3"
                className={inputClass}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentApply;
