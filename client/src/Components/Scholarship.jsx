import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import PageHeader from "./PageHeader";
import TrackIcon from "./TrackIcon";
import { benefits, scholarshipInfo } from "../data/site";

const Scholarship = () => {
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
    </>
  );
};

export default Scholarship;
