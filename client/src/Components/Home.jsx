import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  ClipboardCheck,
  Hammer,
  Users,
  CheckCircle2,
  GraduationCap,
  Layers,
  Laptop,
} from "lucide-react";
import TracksPreview from "./TracksPreview";
import TestimonialsPreview from "./TestimonialsPreview";
import TrackIcon from "./TrackIcon";
import { benefits, homeStats, learningModes } from "../data/site";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

// Numbers live in data/site.js (replace the placeholders there)
const statIcons = [Layers, GraduationCap, Laptop];
const stats = homeStats.map((s, i) => ({ ...s, icon: statIcons[i] || Layers }));

const steps = [
  {
    icon: ClipboardCheck,
    title: "Apply",
    text: "Create your student account and submit your application in a few minutes.",
  },
  {
    icon: Users,
    title: "Learn with mentors",
    text: "Study the fundamentals with guidance from experienced instructors.",
  },
  {
    icon: Hammer,
    title: "Build real projects",
    text: "Work on hands-on Cloud and DevOps projects that mirror real industry tasks.",
  },
  {
    icon: Award,
    title: "Get certified",
    text: "Graduate with a certificate that employers can verify online.",
  },
];

const pathItems = [
  { label: "Foundations", progress: "w-full" },
  { label: "Core skills", progress: "w-4/5" },
  { label: "Real projects", progress: "w-3/5" },
  { label: "Capstone and career prep", progress: "w-2/5" },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forge-50 via-white to-white pt-28 sm:pt-32">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-forge-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-ember-300/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 lg:grid-cols-2 lg:pb-28">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.span variants={fadeUp} className="section-eyebrow">
              Applications are open
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
            >
              Forge a career in{" "}
              <span className="bg-gradient-to-r from-forge-600 to-ember-500 bg-clip-text text-transparent">
                Tech
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
            >
              Learn software, data, cloud, cybersecurity, design, marketing and
              more with hands-on projects, expert mentorship and support all the
              way to your first role.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <Link to="/student-register" className="btn-primary">
                Apply Now <ArrowRight size={18} />
              </Link>
              <Link to="/tracks" className="btn-outline">
                Explore Courses
              </Link>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600"
            >
              {["Beginner friendly", "Mentor-led", "Verifiable certificates"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-forge-500" />
                    {item}
                  </li>
                )
              )}
            </motion.ul>
          </motion.div>

          {/* Learning path card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="rounded-3xl border border-forge-100 bg-white p-7 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-forge-500">
                    Your learning path
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-forge-950">
                    From beginner to job-ready
                  </p>
                </div>
                <span className="rounded-full bg-ember-400/20 px-3 py-1 text-xs font-bold text-ember-600">
                  Hands-on
                </span>
              </div>

              <ul className="mt-6 space-y-5">
                {pathItems.map((item) => (
                  <li key={item.label}>
                    <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                      <span>{item.label}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-forge-50">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-forge-500 to-ember-500 ${item.progress}`}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-center gap-3 rounded-2xl bg-forge-50 p-4">
                <BadgeCheck className="text-forge-600" size={28} />
                <p className="text-sm font-medium text-forge-900">
                  Finish the path and earn a certificate you can verify online.
                </p>
              </div>
            </div>

            {/* floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-forge-100 bg-white px-4 py-3 shadow-card sm:flex"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forge-600 text-white">
                <Users size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-forge-950">Mentor-led</p>
                <p className="text-xs text-slate-500">Real guidance, every step</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 -mt-4 px-6">
        <div className="mx-auto grid max-w-5xl gap-6 rounded-3xl border border-forge-100 bg-white p-8 shadow-card sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-4 sm:justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forge-50 text-forge-600">
                <Icon size={26} />
              </span>
              <div>
                <p className="font-display text-3xl font-extrabold text-forge-950">
                  {value}
                </p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ALL TRACKS */}
      <TracksPreview />

      {/* HOW IT WORKS */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">How it works</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              From first click to first job, in four steps
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="relative rounded-2xl border border-forge-100 bg-white p-6 shadow-card"
              >
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-forge-50">
                  {index + 1}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-forge-600 text-white">
                  <Icon size={22} />
                </span>
                <h3 className="relative mt-5 text-lg font-bold">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-forge-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Why IHEM Forge</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              We're more than an academy, we're your partner in growth
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-400/20 text-ember-600">
                  <TrackIcon name={icon} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING MODES + SCHOLARSHIP */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="section-eyebrow">Learn your way</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Online, in-person or hybrid, and funding for those who need it
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Pick the format that fits your life. If tuition is a barrier, our
              scholarship programme can help you start anyway.
            </p>
            <Link to="/scholarship" className="btn-primary mt-8">
              See scholarship details <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {learningModes.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-forge-100 bg-forge-50/60 p-5"
              >
                <p className="font-display text-lg font-bold text-forge-950">
                  {m.label}
                </p>
                <p className="mt-1 text-sm text-slate-600">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsPreview />

      {/* FINAL CTA */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-forge-700 to-forge-950 px-8 py-16 text-center shadow-glow">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-ember-500/30 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold !text-white sm:text-4xl">
            Ready to start your tech journey?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-forge-100">
            Join IHEMFORGE Academy and build the skills employers are
            looking for. Applications are open now.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/student-register" className="btn-accent">
              Apply Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
