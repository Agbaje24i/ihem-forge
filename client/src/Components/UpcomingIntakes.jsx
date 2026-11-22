import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { formatDate, naira, publicRequest } from "../api";
import { tracks } from "../data/tracks";

// Open cohorts the admin has created, soonest first. Hidden when there are none.
const UpcomingIntakes = () => {
  const [intakes, setIntakes] = useState([]);

  useEffect(() => {
    let active = true;
    publicRequest("/cohorts").then(({ ok, data }) => {
      if (!active || !ok || !Array.isArray(data)) return;

      // One card per intake (same name and start date); its tracks are listed inside
      const groups = new Map();
      [...data]
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .forEach((c) => {
          const key = `${c.name}|${c.startDate}`;
          if (!groups.has(key)) groups.set(key, { key, name: c.name, startDate: c.startDate, mode: c.mode, cohorts: [] });
          groups.get(key).cohorts.push(c);
        });
      setIntakes([...groups.values()]);
    });
    return () => {
      active = false;
    };
  }, []);

  if (intakes.length === 0) return null;

  return (
    <section className="bg-forge-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Upcoming intakes</span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Pick your start date</h2>
          <p className="mt-3 text-slate-600">Seats are limited, so apply early.</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {intakes.map((g) => {
            const fees = g.cohorts.map((c) => c.tuition).filter((n) => n > 0);
            const low = fees.length ? Math.min(...fees) : 0;
            const high = fees.length ? Math.max(...fees) : 0;
            return (
              <div key={g.key} className="flex flex-col rounded-2xl border border-forge-100 bg-white p-6 shadow-card">
                <h3 className="text-xl font-bold">{g.name}</h3>
                <p className="mt-3 flex items-center gap-2 text-slate-700">
                  <CalendarDays size={18} className="text-forge-600" /> Starts {formatDate(g.startDate)}
                </p>
                <p className="mt-1 text-sm capitalize text-slate-500">
                  {g.mode === "any" ? "Online, in-person or hybrid" : g.mode}
                  {high ? ` · ${low === high ? naira(low) : `${naira(low)} - ${naira(high)}`}` : ""}
                </p>

                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  {g.cohorts.length === 1 ? "Track" : `${g.cohorts.length} tracks`}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {g.cohorts.map((c) => {
                    const track = tracks.find((t) => t.name === c.track);
                    const full = c.seatsLeft <= 0;
                    return (
                      <li key={c._id}>
                        <Link
                          to={track ? `/student-apply?track=${track.slug}` : "/student-apply"}
                          title={full ? "Cohort full" : `${c.seatsLeft} seats left`}
                          className={`inline-block rounded-full border px-3 py-1 text-sm font-medium transition ${
                            full
                              ? "border-slate-200 text-slate-400 line-through"
                              : "border-forge-200 text-forge-800 hover:bg-forge-50"
                          }`}
                        >
                          {c.track}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingIntakes;
