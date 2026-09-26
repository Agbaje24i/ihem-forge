import React, { useEffect, useState } from "react";

const Students = () => {
  const [students, setStudents] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Tracks whether the form popup is in "edit" mode, and which student is being edited
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Search term for filtering the table
  const [searchTerm, setSearchTerm] = useState("");

  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    course: "",
  });

  // ==========================
  // LOAD STUDENTS
  // ==========================

  const loadStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/students");

      const data = await response.json();

      setStudents(data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ==========================
  // SAVE STUDENT (handles both Add and Edit)
  // ==========================

  const saveStudent = async () => {
    try {

      const url = isEditing
        ? `http://localhost:5000/students/${editingId}`
        : "http://localhost:5000/students";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();

      if (response.ok) {

        alert(isEditing ? "Student Updated Successfully" : "Student Added Successfully");

        setStudent({
          fullName: "",
          email: "",
          phone: "",
          gender: "",
          course: "",
        });

        setShowForm(false);
        setIsEditing(false);
        setEditingId(null);

        // Reload students immediately
        loadStudents();

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.log(err);

      alert("Server Connection Error");

    }
  };

  // ==========================
  // EDIT STUDENT
  // ==========================

  const startEdit = (item) => {
    setStudent({
      fullName: item.fullName || "",
      email: item.email || "",
      phone: item.phone || "",
      gender: item.gender || "",
      course: item.course || "",
    });

    setEditingId(item._id);
    setIsEditing(true);
    setShowForm(true);
  };

  // ==========================
  // DELETE STUDENT
  // ==========================

  const deleteStudent = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${item.fullName}?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/students/${item._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Student Deleted Successfully");
        loadStudents();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete student");
      }

    } catch (err) {
      console.log(err);
      alert("Server Connection Error");
    }
  };

  // ==========================
  // SEARCH / FILTER
  // ==========================

  const filteredStudents = students.filter((item) => {
    const term = searchTerm.toLowerCase();

    return (
      item.fullName?.toLowerCase().includes(term) ||
      item.course?.toLowerCase().includes(term) ||
      item.studentId?.toString().toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative rounded-xl overflow-hidden shadow-lg mb-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "250px",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 p-10 text-white flex flex-col justify-center h-full">
          <h1 className="text-5xl font-bold">
            Student Management
          </h1>

          <p className="text-xl mt-3">
            Manage all registered students, admissions and student records.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Students
          </h2>

          <p className="text-gray-600 mt-2">
            View, edit and manage all students.
          </p>
        </div>

        <button
          onClick={() => {
            setStudent({
              fullName: "",
              email: "",
              phone: "",
              gender: "",
              course: "",
            });
            setIsEditing(false);
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow"
        >
          + Add Student
        </button>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">

        <input
          type="text"
          placeholder="Search student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

  {filteredStudents.length === 0 ? (

    <tr>

      <td colSpan="5" className="text-center p-8 text-gray-500">
        No students found.
      </td>

    </tr>

  ) : (

    filteredStudents.map((item) => (

      <tr key={item._id} className="border-b hover:bg-gray-50">

        <td className="p-3">
          {item.studentId}
        </td>

        <td className="p-3">
          {item.fullName}
        </td>

        <td className="p-3">
          {item.course}
        </td>

        <td className="p-3">

          <span className="bg-green-600 text-white px-3 py-1 rounded-full">
            {item.status}
          </span>

        </td>

        <td className="p-3 text-center space-x-2">

          <button
            onClick={() => {
              setSelectedStudent(item);
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
            onClick={() => deleteStudent(item)}
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
      </div>

      {/* Add / Edit Student Popup */}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-[550px] p-8">

            <h2 className="text-3xl font-bold mb-6">
              {isEditing ? "Edit Student" : "Add New Student"}
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              value={student.fullName}
              onChange={(e) =>
                setStudent({
                  ...student,
                  fullName: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-4"
            />

            <input
              type="email"
              placeholder="Email"
              value={student.email}
              onChange={(e) =>
                setStudent({
                  ...student,
                  email: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-4"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={student.phone}
              onChange={(e) =>
                setStudent({
                  ...student,
                  phone: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-4"
            />

            <select
              value={student.gender}
              onChange={(e) =>
                setStudent({
                  ...student,
                  gender: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-4"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              type="text"
              placeholder="Course"
              value={student.course}
              onChange={(e) =>
                setStudent({
                  ...student,
                  course: e.target.value,
                })
              }
              className="border w-full rounded-lg p-3 mb-6"
            />

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
                onClick={saveStudent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {isEditing ? "Update Student" : "Save Student"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* View Student Popup */}

      {showView && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

          <div className="bg-white w-[500px] rounded-xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Student Details
            </h2>

            <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
            <p><strong>Name:</strong> {selectedStudent.fullName}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Phone:</strong> {selectedStudent.phone}</p>
            <p><strong>Gender:</strong> {selectedStudent.gender}</p>
            <p><strong>Course:</strong> {selectedStudent.course}</p>
            <p><strong>Status:</strong> {selectedStudent.status}</p>

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

export default Students;
