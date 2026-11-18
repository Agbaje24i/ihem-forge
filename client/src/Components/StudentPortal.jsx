import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, ExternalLink, LogOut } from "lucide-react";
import { formatDate, formatDateTime, naira, studentRequest } from "../api";

const statusStyle = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Waitlisted: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-700",
};

const statusMessage = {
  Pending: "Your application is being reviewed. We will update this page when a decision is made.",
  Approved: "You are in. Your classes and progress are below.",
  Waitlisted: "You are on the waiting list. We will contact you if a seat opens.",
  Rejected: "Your application was not successful this time.",
};

const kindLabel = { class: "Class", assignment: "Assignment", resource: "Resource" };

const Application = ({ app, onToggle }) => {
  const { finance: f, cohort, lessons, progress } = app;
  const approved = app.status === "Approved";

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

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
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

      {/* Fees */}
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

      {/* Classes */}
      {approved && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Your classes</h3>
            <span className="text-sm text-slate-600">
              {progress.completed}/{progress.total} done · {progress.percent}%
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-forge-100">
            <div className="h-full rounded-full bg-forge-600 transition-all" style={{ width: `${progress.percent}%` }} />
          </div>

          {lessons.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              {cohort ? "No classes have been posted yet. Check back soon." : "You will see classes once you are placed in a cohort."}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lessons.map((l) => (
                <li key={l._id} className="flex items-start gap-3 rounded-2xl border border-forge-100 p-4">
                  <button
                    onClick={() => onToggle(l)}
                    aria-label={l.completed ? "Mark as not done" : "Mark as done"}
                    className="mt-0.5 text-forge-600"
                  >
                    {l.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold ${l.completed ? "text-slate-400 line-through" : ""}`}>
                      {l.title}{" "}
                      <span className="ml-1 rounded bg-forge-50 px-2 py-0.5 text-xs font-medium uppercase text-forge-700">
                        {kindLabel[l.kind] || l.kind}
                      </span>
                    </p>
                    {l.date && <p className="text-sm text-slate-500">{formatDateTime(l.date)}</p>}
                    {l.description && <p className="mt-1 text-sm text-slate-600">{l.description}</p>}
                    {l.link && (
                      <a
                        href={l.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-forge-600 hover:underline"
                      >
                        Open link <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
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

  const toggle = async (lesson) => {
    const completed = !lesson.completed;
    // Optimistic update, then re-sync from the server
    setData((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => {
        if (!a.lessons.some((l) => l._id === lesson._id)) return a;
        const lessons = a.lessons.map((l) => (l._id === lesson._id ? { ...l, completed } : l));
        const done = lessons.filter((l) => l.completed).length;
        return {
          ...a,
          lessons,
          progress: {
            total: lessons.length,
            completed: done,
            percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
          },
        };
      }),
    }));
    const { ok } = await studentRequest(`/student/lessons/${lesson._id}/complete`, {
      method: "POST",
      body: { completed },
    });
    if (!ok) load();
  };

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
              {data ? `Hello, ${data.student.fullName}` : "My portal"}
            </h1>
            <p className="mt-2 text-slate-600">Your applications, classes and progress in one place.</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-forge-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-forge-50"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>

        <div className="mt-8 space-y-6">
          {loading && <p className="text-slate-600">Loading...</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          {data && data.applications.length === 0 && (
            <div className="rounded-3xl border border-forge-100 bg-white p-8 text-center shadow-card">
              <p className="text-slate-600">You have not applied to a track yet.</p>
              <Link to="/student-apply" className="btn-primary mt-4 inline-flex">
                Apply now
              </Link>
            </div>
          )}

          {data && data.applications.map((a) => <Application key={a._id} app={a} onToggle={toggle} />)}

          {data && data.applications.length > 0 && (
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
