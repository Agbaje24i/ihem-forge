import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { formatDateTime, studentRequest } from "../api";

// Turns a YouTube / Vimeo link into an embeddable address. Other links are
// shown as a normal "Watch video" link instead.
function embedUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (host === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (host === "vimeo.com" && /^\/\d+/.test(u.pathname)) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
  } catch {}
  return "";
}

const StudentCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState(null);

  const load = useCallback(async () => {
    const { ok, data } = await studentRequest("/student/portal");
    if (!ok) {
      setError(data?.message || "Could not load the course");
      setLoading(false);
      return;
    }
    const found = data.applications.find((a) => a._id === id);
    setApp(found || null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    let token = "";
    try {
      token = localStorage.getItem("studentToken") || "";
    } catch {}
    if (!token) {
      navigate(`/student-login?redirect=${encodeURIComponent(`/student-portal/course/${id}`)}`, { replace: true });
      return;
    }
    load();
  }, [navigate, load, id]);

  const lessons = app?.lessons || [];

  // Open on the first unfinished lesson (the "resume" spot)
  useEffect(() => {
    if (currentId || lessons.length === 0) return;
    const next = lessons.find((l) => !l.completed) || lessons[0];
    setCurrentId(next._id);
  }, [lessons, currentId]);

  const index = lessons.findIndex((l) => l._id === currentId);
  const current = index >= 0 ? lessons[index] : null;

  // Group lessons under their module heading, keeping the order
  const groups = useMemo(() => {
    const out = [];
    lessons.forEach((l) => {
      const name = l.module || "Lessons";
      let g = out.find((x) => x.name === name);
      if (!g) {
        g = { name, items: [] };
        out.push(g);
      }
      g.items.push(l);
    });
    return out;
  }, [lessons]);

  const setDone = async (lesson, completed) => {
    setApp((prev) => {
      const ls = prev.lessons.map((l) => (l._id === lesson._id ? { ...l, completed } : l));
      const done = ls.filter((l) => l.completed).length;
      return {
        ...prev,
        lessons: ls,
        progress: { total: ls.length, completed: done, percent: ls.length ? Math.round((done / ls.length) * 100) : 0 },
      };
    });
    const { ok } = await studentRequest(`/student/lessons/${lesson._id}/complete`, {
      method: "POST",
      body: { completed },
    });
    if (!ok) load();
  };

  const completeAndNext = async () => {
    if (!current.completed) await setDone(current, true);
    if (index < lessons.length - 1) setCurrentId(lessons[index + 1]._id);
  };

  const shell = (children) => (
    <div className="min-h-screen bg-gradient-to-b from-forge-50 to-white pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </div>
  );

  if (loading) return shell(<p className="text-slate-600">Loading...</p>);
  if (error) return shell(<p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>);
  if (!app)
    return shell(
      <p className="text-slate-600">
        We could not find that course. <Link to="/student-portal" className="font-semibold text-forge-600 underline">Back to my courses</Link>
      </p>
    );

  if (app.status !== "Approved")
    return shell(
      <p className="text-slate-600">
        This course opens once your application is approved.{" "}
        <Link to="/student-portal" className="font-semibold text-forge-600 underline">Back to my courses</Link>
      </p>
    );

  const embed = current?.videoUrl ? embedUrl(current.videoUrl) : "";

  return shell(
    <>
      <Link to="/student-portal" className="inline-flex items-center gap-2 text-sm font-semibold text-forge-600 hover:underline">
        <ArrowLeft size={16} /> My courses
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold">{app.course}</h1>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-3 w-full max-w-sm overflow-hidden rounded-full bg-forge-100">
          <div className="h-full rounded-full bg-forge-600 transition-all" style={{ width: `${app.progress.percent}%` }} />
        </div>
        <span className="text-sm text-slate-600">
          {app.progress.completed}/{app.progress.total} · {app.progress.percent}%
        </span>
      </div>

      {lessons.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-forge-100 bg-white p-6 text-slate-600">
          No lessons have been added to this course yet. Check back soon.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Lesson list */}
          <aside className="space-y-5 rounded-2xl border border-forge-100 bg-white p-4 lg:max-h-[70vh] lg:overflow-y-auto">
            {groups.map((g) => (
              <div key={g.name}>
                <p className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">{g.name}</p>
                <ul className="mt-2 space-y-1">
                  {g.items.map((l) => (
                    <li key={l._id}>
                      <button
                        onClick={() => setCurrentId(l._id)}
                        className={`flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left text-sm transition ${
                          l._id === currentId ? "bg-forge-50 font-semibold text-forge-800" : "hover:bg-forge-50"
                        }`}
                      >
                        {l.completed ? (
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                        ) : (
                          <Circle size={18} className="mt-0.5 shrink-0 text-slate-400" />
                        )}
                        <span>{l.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Lesson */}
          {current && (
            <article className="rounded-2xl border border-forge-100 bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-forge-600">
                {current.kind}
                {current.module ? ` · ${current.module}` : ""}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">{current.title}</h2>
              {current.date && <p className="mt-1 text-sm text-slate-500">{formatDateTime(current.date)}</p>}
              {current.description && <p className="mt-3 text-slate-600">{current.description}</p>}

              {embed && (
                <div className="mt-5 aspect-video overflow-hidden rounded-xl bg-black">
                  <iframe
                    src={embed}
                    title={current.title}
                    className="h-full w-full"
                    allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              )}
              {current.videoUrl && !embed && (
                <a href={current.videoUrl} target="_blank" rel="noreferrer noopener" className="mt-5 inline-flex items-center gap-2 font-semibold text-forge-600 hover:underline">
                  Watch video <ExternalLink size={16} />
                </a>
              )}

              {current.content && (
                <div className="mt-5 whitespace-pre-line leading-relaxed text-slate-700">{current.content}</div>
              )}

              {current.link && (
                <a href={current.link} target="_blank" rel="noreferrer noopener" className="mt-5 inline-flex items-center gap-2 font-semibold text-forge-600 hover:underline">
                  Open link <ExternalLink size={16} />
                </a>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-forge-100 pt-5">
                <button
                  onClick={() => index > 0 && setCurrentId(lessons[index - 1]._id)}
                  disabled={index <= 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-forge-100 px-4 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                {current.completed ? (
                  <button onClick={() => setDone(current, false)} className="rounded-xl border border-forge-100 px-4 py-2 text-sm font-semibold">
                    Mark as not done
                  </button>
                ) : null}
                <button onClick={completeAndNext} className="btn-primary !px-5 !py-2.5 text-sm">
                  {current.completed ? "Next" : "Complete and continue"} <ArrowRight size={16} />
                </button>
              </div>
            </article>
          )}
        </div>
      )}
    </>
  );
};

export default StudentCourse;
