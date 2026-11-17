import React from "react";
import { Link } from "react-router-dom";
import { Quote } from "lucide-react";

// TODO: Replace these with real student testimonials
const testimonials = [
  {
    name: "Student Name",
    role: "Cloud Computing Student",
    quote:
      "The hands-on projects gave me real confidence going into interviews. I landed my first cloud role within weeks of graduating.",
  },
  {
    name: "Student Name",
    role: "DevOps Student",
    quote:
      "I had zero tech background before joining. The step-by-step mentorship made all the difference — I finally understand CI/CD pipelines.",
  },
  {
    name: "Student Name",
    role: "Web Development Student",
    quote:
      "Best decision I made this year. The instructors actually care about your progress and check in regularly.",
  },
];

const TestimonialsPreview = () => {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-eyebrow">Student stories</span>
        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          What our students are saying
        </h2>
        <p className="mt-4 text-slate-600">
          Real stories from IHEM Forge graduates.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-3">
        {testimonials.map((t, index) => (
          <figure
            key={index}
            className="relative flex flex-col rounded-2xl border border-forge-100 bg-forge-50/50 p-7 transition hover:-translate-y-1 hover:shadow-card"
          >
            <Quote className="text-ember-500" size={28} />
            <blockquote className="mt-4 flex-1 leading-relaxed text-slate-700">
              {t.quote}
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forge-600 text-lg font-bold text-white">
                {t.name.charAt(0)}
              </span>
              <span>
                <span className="block font-bold text-forge-950">{t.name}</span>
                <span className="block text-sm text-slate-500">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/testimonials"
          className="font-bold text-forge-600 transition hover:text-forge-800"
        >
          Read more stories →
        </Link>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
