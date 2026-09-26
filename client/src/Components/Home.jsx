import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CoursesPreview from "./CoursesPreview";
import TestimonialsPreview from "./TestimonialsPreview";

function Home() {
  return (
    <>
      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center text-white h-screen"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        {/* Main Content */}
        <div className="relative z-10 mt-16 px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to IHEM Forge Tech Academy
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Empowering the next generation of Cloud & DevOps engineers with
            hands-on training and real-world projects.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/student-register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition"
            >
              Apply Now
            </Link>
            <Link
              to="/courses"
              className="bg-white bg-opacity-10 border border-white hover:bg-opacity-20 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Explore our Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl mb-3">
              🎓
            </div>
            {/* TODO: replace with your real student count */}
            <p className="text-3xl font-bold text-slate-800">500+</p>
            <p className="text-gray-600 mt-1">Students</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl mb-3">
              💼
            </div>
            {/* TODO: replace with your real employment rate */}
            <p className="text-3xl font-bold text-slate-800">85%</p>
            <p className="text-gray-600 mt-1">Employment Rate</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl mb-3">
              📚
            </div>
            {/* TODO: replace with your real course count */}
            <p className="text-3xl font-bold text-slate-800">8+</p>
            <p className="text-gray-600 mt-1">Courses</p>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            Why Choose IHEM Forge?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're more than an academy — we're your partner in growth.
            Here's why learners choose us:
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              Real-World Skills
            </h3>
            <p className="text-gray-600">
              Get one-on-one guidance from seasoned industry experts
              committed to your success.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              Beginner-Friendly Learning
            </h3>
            <p className="text-gray-600">
              No prior tech background? No problem. Our courses start
              from the fundamentals and build progressively.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              Hands-On Projects
            </h3>
            <p className="text-gray-600">
              Work on real Cloud & DevOps projects that prepare you for
              actual industry challenges.
            </p>
          </div>

        </div>
      </section>

      {/* Courses Preview */}
      <CoursesPreview />

      {/* Testimonials Preview */}
      <TestimonialsPreview />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
