import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, LogOut, Search, Users } from "lucide-react";
import { formatDate, naira, studentRequest } from "../api";
import { tracks } from "../data/tracks";

const statusStyle = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Waitlisted: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-700",
};

const statusMessage = {
  Pending: "Your application is being reviewed. We will update this page when a decision is made.",
  Approved: "You are in. Start or continue your course below.",
  Waitlisted: "You are on the waiting list. We will contact you if a seat opens.",
  Rejected: "Your application was not successful this time.",
};

// Which filter group a course belongs to
const groupOf = (a) => {
  if (a.status !== "Approved") return "applied";
  return a.progress.total > 0 && a.progress.percent === 100 ? "completed" : "progress";
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "progress", label: "In progress" },
  { id: "completed", label: "Completed" },
  { id: "applied", label: "Applied" },
];

const CourseCard = ({ app }) => {
  const { finance: f, cohort, progress } = app;
  const approved = app.status === "Approved";
  const track = tracks.find((t) => t.name === app.course);

  return (
    <section className="rounded-3xl border border-forge-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">{app.course}</h2>
          <p className="text-sm text-slate-500">
            {app.applicationId} · applied {formatDate(app.appliedAt)}
          </p>
        </div>
        <span className={`rounded-full px-4 py-1 text-sm font-semibold ${statusStyle[app.status] || statusStyle.Pending}`}>
          {app.status || "Pending"}
        </span>
      </div>

      <p className="mt-3 text-slate-600">{statusMessage[app.status] || statusMessage.Pending}</p>
      {app.reviewNote && app.status !== "Pending" && (
        <p className="mt-2 rounded-xl bg-forge-50 p-3 text-sm text-slate-700">Note from the team: {app.reviewNote}</p>
      )}

      {approved && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Your progress</span>
            <span>
              {progress.completed}/{progress.total} lessons · {progress.percent}%
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-forge-100">
            <div className="h-full rounded-full bg-forge-600 transition-all" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {approved && (
          <Link to={`/student-portal/course/${app._id}`} className="btn-primary !px-5 !py-2.5 text-sm">
            {progress.completed > 0 ? "Resume course" : "Start course"}
          </Link>
        )}
        {track && (
          <Link to={`/tracks/${track.slug}`} className="btn-outline !px-5 !py-2.5 text-sm">
            See overview
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-forge-50 p-4">
          <p className="text-xs text-slate-500">Cohort</p>
          <p className="font-bold">{cohort ? cohort.name : "Not assigned yet"}</p>
        </div>
        <div className="rounded-2xl bg-forge-50 p-4">
          <p className="text-xs text-slate-500">Starts</p>
          <p className="font-bold">{cohort ? formatDate(cohort.startDate) : "TBA"}</p>
        </div>
        <div className="rounded-2xl bg-forge-50 p-4">
          <p className="text-xs text-slate-500">Learning mode</p>
          <p className="font-bold capitalize">{cohort && cohort.mode !== "any" ? cohort.mode : app.learningMode || "-"}</p>
        </div>
      </div>

      {approved && cohort?.communityLink && (
        <a
          href={cohort.communityLink}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-5 flex items-center gap-3 rounded-2xl border border-forge-100 p-4 transition hover:bg-forge-50"
        >
          <Users size={20} className="text-forge-600" />
          <span>
            <span className="block font-semibold">Join your cohort community</span>
            <span className="text-sm text-slate-600">Chat with your mentors and classmates.</span>
          </span>
        </a>
      )}

      {cohort && f.tuition > 0 && (
        <div className="mt-6">
          <h3 className="font-bold">Fees</h3>
          <div className="mt-2 grid gap-3 sm:grid-cols-4">
            {[
              ["Full fee", naira(f.tuition)],
              [`Scholarship (${f.scholarshipPercent}%)`, `-${naira(f.discount)}`],
              ["Paid", naira(f.paid)],
              ["Balance", naira(f.balance)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-forge-100 p-3">
                <p className="text-xs text-slate-500">{k}</p>
                <p className="font-bold">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Status: <strong>{f.status}</strong>. To pay, contact the academy; payments are confirmed by our team.
          </p>
          {app.payments.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {app.payments.map((p) => (
                <li key={p._id}>
                  {naira(p.amount)} · {p.method} · {formatDate(p.paidAt)}
                  {p.reference ? ` · ref ${p.reference}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

const StudentPortal = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const { ok, data: body } = await studentRequest("/student/portal");
    if (ok) {
      setData(body);
      setError("");
    } else {
      setError(body?.message || "Could not load your portal");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let token = "";
    try {
      token = localStorage.getItem("studentToken") || "";
    } catch {}
    if (!token) {
      navigate("/student-login?redirect=%2Fstudent-portal", { replace: true });
      return;
    }
    load();
  }, [navigate, load]);

  const apps = data?.applications || [];

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (filter !== "all" && groupOf(a) !== filter) return false;
      return !q || a.course.toLowerCase().includes(q);
    });
  }, [apps, filter, search]);

  const logout = () => {
    try {
      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentInfo");
    } catch {}
    navigate("/student-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-forge-50 to-white pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              {data ? `Welcome back, ${data.student.fullName}` : "My courses"}
            </h1>
            <p className="mt-2 text-slate-600">Your courses, progress, fees and certificates in one place.</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-forge-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-forge-50"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>

        {apps.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search my courses"
                className="w-full rounded-xl border border-forge-100 bg-white py-2.5 pl-9 pr-3 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filter === f.id ? "bg-forge-600 text-white" : "bg-white text-slate-700 hover:bg-forge-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {loading && <p className="text-slate-600">Loading...</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          {data && apps.length === 0 && (
            <div className="rounded-3xl border border-forge-100 bg-white p-8 text-center shadow-card">
              <p className="text-slate-600">You have not applied to a track yet.</p>
              <Link to="/student-apply" className="btn-primary mt-4 inline-flex">
                Apply now
              </Link>
            </div>
          )}

          {data && apps.length > 0 && visible.length === 0 && (
            <p className="text-slate-600">No courses match your filter.</p>
          )}

          {visible.map((a) => (
            <CourseCard key={a._id} app={a} />
          ))}

          {data && (
            <div className="flex items-center gap-3 rounded-2xl border border-forge-100 bg-white p-5">
              <Award size={22} className="text-forge-600" />
              <div>
                <p className="font-semibold">Certificates</p>
                <p className="text-sm text-slate-600">
                  When you finish, the academy issues your certificate. Anyone can check it on the{" "}
                  <Link to="/verify" className="font-semibold text-forge-600 underline">
                    verify page
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          {data && apps.length > 0 && (
            <p className="text-center text-sm">
              <Link to="/student-apply" className="font-semibold text-forge-600 hover:underline">
                Apply to another track
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
