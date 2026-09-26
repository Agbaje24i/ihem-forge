import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const StudentApply = () => {
  const navigate = useNavigate();

  const [studentInfo, setStudentInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    course: "",
    phone: "",
    gender: "",
    qualification: "",
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    const info = localStorage.getItem("studentInfo");

    if (!token || !info) {
      navigate("/student-login");
      return;
    }

    setStudentInfo(JSON.parse(info));
    loadCourses();
  }, [navigate]);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: studentInfo.fullName,
          email: studentInfo.email,
          phone: form.phone,
          course: form.course,
          gender: form.gender,
          qualification: form.qualification,
          message: form.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Application submitted successfully! We'll be in touch soon.");
        setForm({
          course: "",
          phone: "",
          gender: "",
          qualification: "",
          message: "",
        });
      } else {
        setError(data.message || "Failed to submit application");
      }
    } catch (err) {
      setError("Server connection error");
    }

    setSubmitting(false);
  };

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    navigate("/student-login");
  };

  if (!studentInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden shadow-lg"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "280px",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 p-10 text-white flex flex-col justify-center h-full max-w-4xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Welcome, {studentInfo.fullName}
              </h1>
              <p className="text-xl mt-3">
                Apply for a course below and start your journey with us.
              </p>
            </div>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto -mt-16 relative z-20 pb-16 px-4">

        <div className="bg-white rounded-xl shadow-2xl p-8">

          {success && (
            <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
              {success}
            </p>
          )}

          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block font-semibold mb-1 text-slate-700">
                Course
              </label>

              {loading ? (
                <p className="text-gray-500">Loading courses...</p>
              ) : (
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c.courseName}>
                      {c.courseName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">
                Highest Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g. B.Sc Computer Science"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">
                Message (optional)
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default StudentApply;
