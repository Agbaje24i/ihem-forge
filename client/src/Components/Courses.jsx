import React, { useState } from "react";
import {
  FaServer,
  FaMobileAlt,
  FaPencilRuler,
  FaNetworkWired,
  FaCloud,
} from "react-icons/fa";

const programsData = [
  {
    icon: <FaCloud className="text-4xl mb-3 mx-auto text-blue-400" />,
    name: "DevOps & CI/CD",
    courses: ["Azure DevOps", "CI/CD Pipeline", "Docker & Kubernetes", "Terraform"],
  },
  {
    icon: <FaMobileAlt className="text-4xl mb-3 mx-auto text-green-400" />,
    name: "Mobile App Development",
    courses: ["React Native", "Flutter", "Android Studio", "iOS Development"],
  },
  {
    icon: <FaPencilRuler className="text-4xl mb-3 mx-auto text-pink-400" />,
    name: "UI/UX Design",
    courses: ["Figma", "Adobe XD", "User Research", "Wireframing & Prototyping"],
  },
  {
    icon: <FaNetworkWired className="text-4xl mb-3 mx-auto text-yellow-400" />,
    name: "Networking & Infrastructure",
    courses: ["Cisco Networking", "Azure Networking", "Firewall & Security", "VPN Setup"],
  },
  {
    icon: <FaServer className="text-4xl mb-3 mx-auto text-purple-400" />,
    name: "Cloud Engineering",
    courses: ["Azure Fundamentals", "AWS Cloud", "Server Management", "Cloud Security"],
  },
];

function Courses() {
  const [selected, setSelected] = useState(programsData[0].name);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const filteredProgram = programsData.find((p) => p.name === selected);

  const handleEnrollClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          course: filteredProgram.name,
          message: formData.message,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit application");

      alert(`✅ Enrollment Successful!\nName: ${formData.name}\nEmail: ${formData.email}\nProgram: ${filteredProgram.name}`);
      setShowModal(false);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <section
      className="min-h-screen py-20 px-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Our Programs & Courses</h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {programsData.map((program) => (
            <button
              key={program.name}
              onClick={() => setSelected(program.name)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selected === program.name ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {program.name}
            </button>
          ))}
        </div>

        {/* Course Card */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          <div className="bg-gray-900 bg-opacity-80 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300">
            {filteredProgram.icon}
            <h3 className="text-2xl font-bold mb-4">{filteredProgram.name}</h3>
            <ul className="mb-4 text-gray-300">
              {filteredProgram.courses.map((course) => (
                <li key={course} className="mb-2">• {course}</li>
              ))}
            </ul>
            <button
              onClick={handleEnrollClick}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-11/12 md:w-1/3 p-6 text-gray-800 relative shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-center text-blue-700">
              Enroll in {filteredProgram.name}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Message (optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
            <button
              onClick={handleClose}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Courses;
