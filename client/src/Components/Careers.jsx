import React, { useState, useEffect } from "react";
import axios from "axios";

// Job Openings
const openings = [
  {
    id: 1,
    title: "Cloud Engineer Intern",
    type: "Internship",
    location: "Remote",
    description:
      "Assist in managing cloud infrastructure and deployments using Azure and DevOps tools.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 2,
    title: "Frontend Developer",
    type: "Full-Time",
    location: "Abuja, Nigeria",
    description:
      "Work with our design and development team to create responsive and dynamic web applications.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    type: "Full-Time",
    location: "Hybrid",
    description:
      "Design intuitive interfaces and experiences for our web and mobile applications.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    type: "Full-Time",
    location: "Remote",
    description:
      "Manage CI/CD pipelines, cloud infrastructure, and ensure high availability systems.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 5,
    title: "Backend Developer",
    type: "Full-Time",
    location: "Remote",
    description:
      "Develop and maintain server-side applications and APIs for web and mobile platforms.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 6,
    title: "Product Manager",
    type: "Full-Time",
    location: "Hybrid",
    description:
      "Lead cross-functional teams to define, design, and deliver innovative software solutions.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  },
];

// Featured Projects
const projects = [
  {
    id: 1,
    title: "Cloud Automation Platform",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 2,
    title: "Student Portal Web App",
    image:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    title: "UX Redesign Project",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1350&q=80",
  },
];

const Careers = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e) => setResumeFile(e.target.files[0]);
  const openForm = (position) => {
    setSelectedPosition(position);
    setFormData({ ...formData, position: position.title });
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    if (resumeFile) data.append("resume", resumeFile);

    try {
      const res = await axios.post("http://localhost:5000/careers", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(res.data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        message: "",
      });
      setResumeFile(null);
      setSelectedPosition(null);
    } catch (err) {
      console.error("Career submission error:", err);
      setStatus("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen py-12 px-6">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 flex items-center justify-center text-center mb-12 rounded-xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 opacity-40"></div>
        <div className="relative z-10 text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Build Your Career with IHEM Forge
          </h1>
          <p className="text-md md:text-lg">
            Join our innovators in Cloud, DevOps, UI/UX, and Software
            Development.
          </p>
        </div>
      </section>

      {/* Job Openings Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
        {openings.map((job) => (
          <div
            key={job.id}
            className="relative group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500 transform hover:-translate-y-2"
          >
            <div className="overflow-hidden h-52">
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 mb-1">
                {job.type} • {job.location}
              </p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {job.description}
              </p>
              <button
                onClick={() => openForm(job)}
                className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Projects */}
      <section className="mb-16 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-blue-700">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setSelectedPosition(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              Apply for {selectedPosition.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 border rounded-xl"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border rounded-xl"
                required
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-3 border rounded-xl"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full p-3 border rounded-xl h-24"
              ></textarea>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border rounded-xl p-2"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Submit Application
              </button>
            </form>
            {status && (
              <p className="mt-4 text-center text-gray-700 font-medium">
                {status}
              </p>
            )}
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Careers;
