import React, { useState } from "react";

const faqData = [
  {
    category: "General",
    question: "What is IHEM Forge?",
    answer:
      "IHEM Forge is a technology training hub that provides world-class education in Cloud Computing, DevOps, Mobile App Development, UI/UX, and Networking.",
  },
  {
    category: "Application",
    question: "How can I apply for a program?",
    answer:
      "You can apply by filling the online application form available on our Apply page or through our partnership registration portals.",
  },
  {
    category: "Courses",
    question: "Do you offer online training?",
    answer:
      "Yes! We offer both on-site and online training programs to suit different learners’ schedules and locations.",
  },
  {
    category: "Courses",
    question: "Are beginners welcome in your DevOps program?",
    answer:
      "Absolutely. Our DevOps curriculum starts with foundational concepts before progressing to advanced automation and deployment topics.",
  },
  {
    category: "Payment",
    question: "What payment options are available?",
    answer:
      "We accept online payments, bank transfers, and installment options for certain programs.",
  },
  {
    category: "Events",
    question: "How often do you host tech events or bootcamps?",
    answer:
      "We host at least one major event every quarter, including bootcamps, webinars, and cloud career mentorship sessions.",
  },
];

const categories = ["All", "General", "Application", "Courses", "Payment", "Events"];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Filter FAQs by category and search
  const filteredFAQs = faqData.filter((faq) => {
    const matchCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div
      className="min-h-screen px-6 py-12 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search a question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-blue-600 border-blue-600"
                  : "bg-transparent border-gray-400 hover:bg-blue-500 hover:border-blue-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <p className="text-center text-gray-300">
              No results found. Try another keyword.
            </p>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:bg-opacity-20"
                onClick={() => toggleFAQ(index)}
              >
                <h2 className="text-xl font-semibold flex justify-between items-center">
                  {faq.question}
                  <span className="ml-4 text-2xl">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </h2>
                {activeIndex === index && (
                  <p className="mt-2 text-gray-200 transition-all duration-300">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
