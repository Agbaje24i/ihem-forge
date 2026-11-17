import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import PageHeader from "./PageHeader";

const faqData = [
  {
    category: "General",
    question: "What is IHEM Forge?",
    answer:
      "IHEM Forge is a technology training academy offering beginner-friendly tracks in software development, data and AI, cloud and DevOps, cybersecurity, design and product, and digital marketing.",
  },
  {
    category: "General",
    question: "Which tracks can I learn?",
    answer:
      "We offer many tracks, including Frontend, Backend and Full-Stack Development, Mobile Apps, Data Analytics, Data Science, AI & Automation, Cloud Computing, DevOps, Cybersecurity, Product Design, Product and Project Management, Digital Marketing and more. See the Tracks page for the full list.",
  },
  {
    category: "Application",
    question: "How can I apply?",
    answer:
      "Create a student account, choose your track and submit the application form. Our admissions team will contact you for a short conversation.",
  },
  {
    category: "Application",
    question: "Do I need prior experience?",
    answer:
      "No. Our tracks are beginner friendly and start from the fundamentals. If you already have some experience, tell us on the application form.",
  },
  {
    category: "Courses",
    question: "Do you offer online training?",
    answer:
      "Yes. Depending on the track and cohort you can learn online, in-person or in a hybrid format. You choose your preferred mode when you apply.",
  },
  {
    category: "Courses",
    question: "Will I get a certificate?",
    answer:
      "Yes. Graduates receive a certificate that employers can verify online using the Verify Certificate page.",
  },
  {
    category: "Payment",
    question: "What payment options are available?",
    answer:
      "We accept online payments, bank transfers, and installment options for certain programs.",
  },
  {
    category: "Payment",
    question: "Is there a scholarship or financial support?",
    answer:
      "Yes, we offer scholarship and funding support for motivated learners. Tick the support option on the application form and tell us why it would help. See the Scholarships page for details.",
  },
  {
    category: "Events",
    question: "How often do you host tech events or bootcamps?",
    answer:
      "We host at least one major event every quarter, including bootcamps, webinars, and career mentorship sessions.",
  },
];

const categories = ["All", "General", "Application", "Courses", "Payment", "Events"];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFAQs = faqData.filter((faq) => {
    const matchCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Quick answers about applying, learning, certificates and support."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <label className="relative block">
            <span className="sr-only">Search questions</span>
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search a question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-forge-100 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-forge-400 focus:ring-2 focus:ring-forge-200"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveIndex(null);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-forge-600 text-white shadow-glow"
                    : "bg-forge-50 text-forge-800 hover:bg-forge-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            {filteredFAQs.length === 0 ? (
              <p className="text-center text-slate-500">
                No results found. Try another keyword.
              </p>
            ) : (
              filteredFAQs.map((faq, index) => {
                const open = activeIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-forge-100 bg-white shadow-card"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(open ? null : index)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className="font-display text-base font-bold text-forge-950">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-forge-500 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open && (
                      <p className="px-5 pb-5 leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default FAQ;
