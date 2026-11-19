import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import PageHeader from "./PageHeader";
import TrackIcon from "./TrackIcon";
import { benefits, scholarshipInfo } from "../data/site";
import { categories, tracks } from "../data/tracks";
import { formatDate, publicRequest } from "../api";

const Scholarship = () => {
  const [nextCohort, setNextCohort] = useState(null);

  // The earliest open intake set by the admin (nothing is hard-coded)
  useEffect(() => {
    let active = true;
    publicRequest("/cohorts").then(({ ok, data }) => {
      if (active && ok && Array.isArray(data) && data.length > 0) {
        const sorted = [...data].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setNextCohort(sorted[0]);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Scholarships & funding"
        title="Start your tech career, whatever your budget"
        subtitle={scholarshipInfo.intro}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/student-register" className="btn-primary">
            Apply now <ArrowRight size={18} />
          </Link>
          <Link to="/tracks" className="btn-outline">
            Browse tracks
          </Link>
        </div>
      </PageHeader>

      {nextCohort && (
        <div className="bg-ember-400 px-6 py-3 text-center text-sm font-semibold text-forge-950">
          Next cohort starts {formatDate(nextCohort.startDate)}. Seats are limited.{" "}
          <Link to="/student-register" className="underline">
            Apply now
          </Link>
        </div>
      )}

      {/* What it covers + eligibility */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-forge-100 bg-white p-8 shadow-card">
            <h2 className="text-2xl font-extrabold">What is included</h2>
            <ul className="mt-6 space-y-4">
              {scholarshipInfo.covers.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-forge-500" size={20} />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-forge-100 bg-white p-8 shadow-card">
            <h2 className="text-2xl font-extrabold">Who can apply</h2>
            <ul className="mt-6 space-y-4">
              {scholarshipInfo.eligibility.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-ember-500" size={20} />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-forge-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">How to apply</span>
            <h2 className="mt-4 text-3xl font-extrabold">Five simple steps</h2>
          </div>

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {scholarshipInfo.steps.map((s, i) => (
              <li
                key={s.title}
                className="relative rounded-2xl bg-white p-6 shadow-card"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forge-600 font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Beyond tuition</span>
            <h2 className="mt-4 text-3xl font-extrabold">
              Everything you get as an IHEM Forge student
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-forge-100 bg-white p-6 shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-400/20 text-ember-600">
                  <TrackIcon name={b.icon} />
                </span>
                <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="bg-forge-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Choose your path</span>
            <h2 className="mt-4 text-3xl font-extrabold">Apply for the track you want</h2>
          </div>

          {categories.map((cat) => (
            <div key={cat.id} className="mt-12">
              <h3 className="text-lg font-bold text-forge-800">{cat.label}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tracks
                  .filter((t) => t.category === cat.id)
                  .map((t) => (
                    <div key={t.slug} className="flex flex-col rounded-2xl bg-white p-5 shadow-card">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forge-600 text-white">
                        <TrackIcon name={t.icon} size={18} />
                      </span>
                      <h4 className="mt-3 font-bold">{t.name}</h4>
                      <p className="mt-1 flex-1 text-sm text-slate-600">{t.tagline}</p>
                      <div className="mt-4 flex gap-4 text-sm font-semibold">
                        <Link to={`/student-apply?track=${t.slug}`} className="text-forge-600 hover:underline">
                          Apply now
                        </Link>
                        <Link to={`/tracks/${t.slug}`} className="text-slate-500 hover:underline">
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="bg-forge-950 px-6 py-16 text-center text-forge-100">
        <h2 className="text-3xl font-extrabold !text-white">Ready to start your tech career?</h2>
        <p className="mx-auto mt-3 max-w-xl">Apply today to secure a place in an upcoming cohort.</p>
        <Link to="/student-register" className="btn-accent mt-6 inline-flex">
          Apply now <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
};

export default Scholarship;
