import React, { useEffect, useState } from "react";

const API = "http://localhost:5000";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [course, setCourse] = useState({
    courseName: "",
    description: "",
    duration: "",
    status: "Active",
  });

  // ==========================
  // LOAD COURSES
  // ==========================

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // ==========================
  // SAVE COURSE (Add / Edit)
  // ==========================

  const saveCourse = async () => {
    try {
      const url = isEditing
        ? `${API}/courses/${editingId}`
        : `${API}/courses`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      const data = await response.json();

      if (response.ok) {
        alert(isEditing ? "Course Updated Successfully" : "Course Added Successfully");

        setCourse({
          courseName: "",
          description: "",
          duration: "",
          status: "Active",
        });

        setShowForm(false);
        setIsEditing(false);
        setEditingId(null);

        loadCourses();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      alert("Server Connection Error");
    }
  };

  // ==========================
  // EDIT COURSE
  // ==========================

  const startEdit = (item) => {
    setCourse({
      courseName: item.courseName || "",
      description: item.description || "",
      duration: item.duration || "",
      status: item.status || "Active",
    });

    setEditingId(item._id);
    setIsEditing(true);
    setShowForm(true);
  };

  // ==========================
  // DELETE COURSE
  // ==========================

  const deleteCourse = async (item) => {
    const ok = window.confirm(
      `Are you sure you want to delete ${item.courseName}?`
    );

    if (!ok) return;

    try {
      const response = await fetch(`${API}/courses/${item._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Course Deleted Successfully");
        loadCourses();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete course");
      }
    } catch (err) {
      console.log(err);
      alert("Server Connection Error");
    }
  };

  // ==========================
  // SEARCH / FILTER
  // ==========================

  const filteredCourses = courses.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.courseName?.toLowerCase().includes(term) ||
      item.duration?.toString().toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative rounded-xl overflow-hidden shadow-lg mb-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "250px",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 p-10 text-white flex flex-col justify-center h-full">
          <h1 className="text-5xl font-bold">
            Course Management
          </h1>

          <p className="text-xl mt-3">
            Manage all courses, curriculum details and enrollment status.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Courses
          </h2>

          <p className="text-gray-600 mt-2">
            View, edit and manage all courses.
          </p>
        </div>

        <button
          onClick={() => {
            setCourse({
              courseName: "",
              description: "",
              duration: "",
              status: "Active",
            });
            setIsEditing(false);
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow"
        >
          + Add Course
        </button>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">

        <input
          type="text"
          placeholder="Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        {loading ? (

          <p>Loading courses...</p>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Course Name</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredCourses.length === 0 ? (

                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    No courses found.
                  </td>
                </tr>

              ) : (

                filteredCourses.map((item) => (

                  <tr key={item._id} className="border-b hover:bg-gray-50">

                    <td className="p-3">
                      {item.courseName}
                    </td>

                    <td className="p-3">
                      {item.duration}
                    </td>

                    <td className="p-3">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full">
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3 text-center space-x-2">

                      <button
                        onClick={() => {
                          setSelectedCourse(item);
                          setShowView(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        🔍 View
                      </button>

                      <button
                        onClick={() => startEdit(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => deleteCourse(item)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        🗑 Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        )}
      </div>

      {/* Add / Edit Course Popup */}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-[550px] p-8">

            <h2 className="text-3xl font-bold mb-6">
              {isEditing ? "Edit Course" : "Add New Course"}
            </h2>

            <input
              type="text"
              placeholder="Course Name"
              value={course.courseName}
              onChange={(e) =>
                setCourse({
                  ...course,
                  courseName: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-4"
            />

            <textarea
              placeholder="Description"
              value={course.description}
              onChange={(e) =>
                setCourse({
                  ...course,
                  description: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-4"
              rows="3"
            />

            <input
              type="text"
              placeholder="Duration (e.g. 6 weeks)"
              value={course.duration}
              onChange={(e) =>
                setCourse({
                  ...course,
                  duration: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-4"
            />

            <select
              value={course.status}
              onChange={(e) =>
                setCourse({
                  ...course,
                  status: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-6"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="flex justify-end gap-4">

              <button
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setEditingId(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={saveCourse}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {isEditing ? "Update Course" : "Save Course"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* View Course Popup */}

      {showView && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

          <div className="bg-white w-[500px] rounded-xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Course Details
            </h2>

            <p><strong>Course Name:</strong> {selectedCourse.courseName}</p>
            <p><strong>Description:</strong> {selectedCourse.description}</p>
            <p><strong>Duration:</strong> {selectedCourse.duration}</p>
            <p><strong>Status:</strong> {selectedCourse.status}</p>

            <div className="flex justify-end mt-6">

              <button
                onClick={() => setShowView(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Courses;
