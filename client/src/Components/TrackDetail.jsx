import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  Laptop,
} from "lucide-react";
import TrackIcon from "./TrackIcon";
import { getCategory, getTrack, tracks } from "../data/tracks";
import { formatDate, naira, publicRequest } from "../api";

const TrackDetail = () => {
  const { slug } = useParams();
  const track = getTrack(slug);
  const [cohorts, setCohorts] = useState([]);
  const trackName = track?.name;

  useEffect(() => {
    setCohorts([]);
    if (!trackName) return;
    let active = true;
    publicRequest(`/cohorts?track=${encodeURIComponent(trackName)}`).then(({ ok, data }) => {
      if (active && ok && Array.isArray(data)) setCohorts(data);
    });
    return () => {
      active = false;
    };
  }, [trackName]);

  if (!track) return <Navigate to="/tracks" replace />;

  const category = getCategory(track.category);
  const related = tracks
    .filter((t) => t.category === track.category && t.slug !== track.slug)
    .slice(0, 3);

  const applyLink = `/student-apply?track=${track.slug}`;

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forge-50 to-white pt-28 pb-14">
        <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-ember-300/40 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Link
            to="/tracks"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forge-600 hover:text-forge-800"
          >
            <ArrowLeft size={16} /> All tracks
          </Link>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="section-eyebrow">{category?.label}</span>
              <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
                {track.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                {track.tagline} {track.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Clock size={16} className="text-forge-500" /> {track.duration}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-forge-500" /> Beginner friendly
                </span>
                <span className="inline-flex items-center gap-2">
                  <Laptop size={16} className="text-forge-500" /> Online, in-person or hybrid
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to={applyLink} className="btn-primary">
                  Apply for this track <ArrowRight size={18} />
                </Link>
                <Link to="/scholarship" className="btn-outline">
                  Scholarship info
                </Link>
              </div>
            </div>

            <div className="hidden justify-center lg:flex">
              <span className="flex h-40 w-40 items-center justify-center rounded-[2rem] bg-gradient-to-br from-forge-500 to-forge-800 text-white shadow-glow">
                <TrackIcon name={track.icon} size={72} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold">What you will learn</h2>
            <ol className="mt-6 space-y-4">
              {track.modules.map((m, i) => (
                <li
                  key={m}
                  className="flex items-start gap-4 rounded-2xl border border-forge-100 bg-white p-5 shadow-card"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forge-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 font-semibold text-forge-950">{m}</span>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 text-2xl font-extrabold">Skills and tools</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {track.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-forge-50 px-4 py-2 text-sm font-semibold text-forge-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-forge-100 bg-white p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Briefcase size={20} className="text-forge-600" /> Career paths
              </h3>
              <ul className="mt-4 space-y-2 text-sm font-medium text-slate-700">
                {track.roles.map((r) => (
                  <li key={r} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-ember-500" /> {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-forge-950 p-6 text-forge-100">
              <h3 className="flex items-center gap-2 text-lg font-bold !text-white">
                <BadgeCheck size={20} className="text-ember-400" /> Included
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Mentorship from professionals</li>
                <li>Hands-on projects for your portfolio</li>
                <li>Career and internship support</li>
                <li>Verifiable certificate</li>
              </ul>
              <Link to={applyLink} className="btn-accent mt-6 w-full">
                Apply now
              </Link>
            </div>

            {cohorts.length > 0 && (
              <div className="rounded-2xl border border-forge-100 bg-white p-6">
                <h3 className="text-lg font-bold">Upcoming intakes</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {cohorts.map((c) => (
                    <li key={c._id} className="rounded-xl bg-forge-50 p-3">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-slate-600">
                        Starts {formatDate(c.startDate)}
                        {c.tuition ? ` · ${naira(c.tuition)}` : ""}
                      </p>
                      <p className="text-slate-500">
                        {c.seatsLeft > 0 ? `${c.seatsLeft} seats left` : "Full"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-forge-50 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-extrabold">More in {category?.label}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  to={`/tracks/${t.slug}`}
                  className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forge-600 text-white">
                    <TrackIcon name={t.icon} size={20} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{t.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{t.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default TrackDetail;
