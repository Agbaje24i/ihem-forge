import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { formatDate, naira, publicRequest } from "../api";
import { tracks } from "../data/tracks";

// Open cohorts the admin has created, soonest first. Hidden when there are none.
const UpcomingIntakes = () => {
  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    let active = true;
    publicRequest("/cohorts").then(({ ok, data }) => {
      if (active && ok && Array.isArray(data)) {
        setCohorts([...data].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 6));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (cohorts.length === 0) return null;

  return (
    <section className="bg-forge-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Upcoming intakes</span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Pick your start date</h2>
          <p className="mt-3 text-slate-600">Seats are limited, so apply early.</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cohorts.map((c) => {
            const track = tracks.find((t) => t.name === c.track);
            const full = c.seatsLeft <= 0;
            return (
              <div key={c._id} className="flex flex-col rounded-2xl border border-forge-100 bg-white p-6 shadow-card">
                <p className="text-sm font-semibold text-forge-600">{c.track}</p>
                <h3 className="mt-1 text-xl font-bold">{c.name}</h3>
                <p className="mt-3 flex items-center gap-2 text-slate-700">
                  <CalendarDays size={18} className="text-forge-600" /> Starts {formatDate(c.startDate)}
                </p>
                <p className="mt-1 text-sm capitalize text-slate-500">
                  {c.mode === "any" ? "Online, in-person or hybrid" : c.mode}
                  {c.tuition ? ` · ${naira(c.tuition)}` : ""}
                </p>
                <p className={`mt-1 text-sm ${full ? "text-red-600" : "text-slate-500"}`}>
                  {full ? "Cohort full" : `${c.seatsLeft} seats left`}
                </p>
                <Link
                  to={track ? `/student-apply?track=${track.slug}` : "/student-apply"}
                  className="btn-primary mt-5 !px-5 !py-2.5 text-sm"
                >
                  Apply now
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingIntakes;
