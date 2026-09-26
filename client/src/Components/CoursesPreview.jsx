import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

const CoursesPreview = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch(`${API}/courses`);
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    loadCourses();
  }, []);

  return (
    <section className="bg-blue-900 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-bold text-white mb-4">
          Our Courses
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto">
          Explore hands-on programs designed to launch your career in tech.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-blue-100">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-blue-100">
          Courses coming soon — check back shortly.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="relative rounded-xl overflow-hidden shadow-lg h-72 flex flex-col justify-end hover:-translate-y-1 transition"
              style={{
                backgroundImage: course.image
                  ? `url(${course.image})`
                  : "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1350&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-55"></div>

              <div className="relative z-10 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {course.courseName}
                </h3>

                <p className="text-sm text-gray-200 mb-4 line-clamp-3">
                  {course.description}
                </p>

                <Link
                  to="/student-register"
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-lg transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CoursesPreview;
