import React from "react";

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
    <section className="bg-white py-20 px-6">

      <div className="max-w-5xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-bold text-blue-800 mb-4">
          What Our Students Are Saying
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real stories from real IHEM Forge graduates.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-lg">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-800">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>

            <p className="text-gray-700">
              "{t.quote}"
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default TestimonialsPreview;
