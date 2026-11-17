import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1350&q=80";

const CoursesPreview = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch(`${API}/courses`);
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    loadCourses();
  }, []);

  return (
    <section className="bg-forge-950 px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-ember-400">
          Our courses
        </span>
        <h2 className="mt-4 text-3xl font-extrabold !text-white sm:text-4xl">
          Programs designed to launch your tech career
        </h2>
        <p className="mt-4 text-forge-200">
          Explore hands-on courses built around real projects and expert
          mentorship.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-forge-200">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-forge-200">
          Courses coming soon, check back shortly.
        </p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course._id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={course.image || FALLBACK_IMAGE}
                  alt={course.courseName}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold">{course.courseName}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {course.description}
                </p>

                <Link
                  to="/student-register"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-forge-600 transition hover:text-forge-800"
                >
                  Enroll now <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link to="/courses" className="btn-accent">
          View all courses <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default CoursesPreview;
