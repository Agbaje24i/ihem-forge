import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Search } from "lucide-react";
import PageHeader from "./PageHeader";
import TrackIcon from "./TrackIcon";
import { categories, tracks } from "../data/tracks";

const Tracks = () => {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tracks.filter((t) => {
      const inCategory = active === "all" || t.category === active;
      const matches =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q));
      return inCategory && matches;
    });
  }, [active, query]);

  return (
    <>
      <PageHeader
        eyebrow="Tracks"
        title="Every path into tech, in one academy"
        subtitle={`Choose from ${tracks.length} beginner-friendly tracks across software, data, cloud, security, design and more.`}
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          {/* Search + filters */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[{ id: "all", label: "All tracks" }, ...categories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active === c.id
                      ? "bg-forge-600 text-white shadow-glow"
                      : "bg-forge-50 text-forge-800 hover:bg-forge-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <label className="relative block w-full lg:w-72">
              <span className="sr-only">Search tracks</span>
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tracks or skills"
                className="w-full rounded-xl border border-forge-100 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-forge-400 focus:ring-2 focus:ring-forge-200"
              />
            </label>
          </div>

          {/* Grid */}
          {visible.length === 0 ? (
            <p className="mt-16 text-center text-slate-500">
              No tracks match your search. Try a different word or filter.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((t) => (
                <Link
                  key={t.slug}
                  to={`/tracks/${t.slug}`}
                  className="group flex flex-col rounded-2xl border border-forge-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-forge-300"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forge-600 text-white">
                    <TrackIcon name={t.icon} />
                  </span>
                  <h2 className="mt-5 text-xl font-bold">{t.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {t.tagline}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Clock size={15} /> {t.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-forge-600 transition group-hover:gap-2.5">
                      View track <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Tracks;
