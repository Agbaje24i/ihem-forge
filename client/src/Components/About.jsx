import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Eye, HandHeart, Target } from "lucide-react";
import PageHeader from "./PageHeader";
import { tracks } from "../data/tracks";

const values = [
  "Excellence in training and mentorship",
  "Innovation and creativity",
  "Integrity and professionalism",
  "Collaboration and community growth",
  "Lifelong learning and adaptability",
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="About IHEM Forge"
        subtitle={`IHEM Forge is a technology training academy committed to giving aspiring professionals practical, job-ready skills across ${tracks.length} tech tracks, from software and data to cloud, security, design and marketing. Our goal is to bridge the gap between education and real-world industry requirements.`}
      />

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-forge-100 bg-white p-8 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forge-600 text-white">
              <Target size={22} />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">Our mission</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              To provide top-quality technical education, mentorship and
              hands-on projects that enable students and professionals to thrive
              in the rapidly evolving tech industry.
            </p>
          </article>

          <article className="rounded-3xl border border-forge-100 bg-white p-8 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forge-600 text-white">
              <Eye size={22} />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">Our vision</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              To become a leading technology academy recognised for producing
              highly skilled, industry-ready professionals capable of innovating
              and shaping the digital future.
            </p>
          </article>

          <article className="rounded-3xl border border-forge-100 bg-white p-8 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-400/20 text-ember-600">
              <HandHeart size={22} />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">Our core values</h2>
            <ul className="mt-3 space-y-2 text-slate-600">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
                  {v}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-forge-100 bg-white p-8 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-400/20 text-ember-600">
              <Award size={22} />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">Our journey</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Since our inception, IHEM Forge has trained students and
              professionals and helped launch them into careers across tech
              companies and startups. Our alumni network keeps growing, and our
              programmes are updated to keep pace with emerging technologies and
              industry standards.
            </p>
          </article>
        </div>

        <div className="mx-auto mt-14 max-w-3xl text-center">
          <Link to="/tracks" className="btn-primary">
            Explore our tracks <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default About;
