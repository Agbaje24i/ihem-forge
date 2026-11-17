import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TrackIcon from "./TrackIcon";
import { categories, tracks } from "../data/tracks";

// Homepage section: every category with the tracks inside it.
const TracksPreview = () => {
  return (
    <section className="bg-forge-950 px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-ember-400">
          {tracks.length} tech tracks
        </span>
        <h2 className="mt-4 text-3xl font-extrabold !text-white sm:text-4xl">
          Whatever you want to do in tech, there is a track for it
        </h2>
        <p className="mt-4 text-forge-200">
          Beginner-friendly, project-based and mentor-led. Pick a path and start
          building.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const items = tracks.filter((t) => t.category === cat.id);
          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest !text-ember-400">
                {cat.label}
              </h3>
              <ul className="mt-5 space-y-1">
                {items.map((t) => (
                  <li key={t.slug}>
                    <Link
                      to={`/tracks/${t.slug}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-forge-100 transition hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forge-600 text-white">
                        <TrackIcon name={t.icon} size={18} />
                      </span>
                      <span className="text-sm font-semibold">{t.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link to="/tracks" className="btn-accent">
          Explore all tracks <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default TracksPreview;
