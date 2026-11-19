import React, { useState } from "react";
import axios from "axios";
import { MapPin, X } from "lucide-react";
import PageHeader from "./PageHeader";
import { inputClass } from "./AuthShell";
import { API } from "../api";


// Job openings - replace with your real roles
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

// Featured projects
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

const emptyForm = { name: "", email: "", phone: "", position: "", message: "" };

const Careers = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  const openForm = (position) => {
    setSelectedPosition(position);
    setFormData({ ...formData, position: position.title });
    setStatus({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", text: "Submitting..." });
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    if (resumeFile) data.append("resume", resumeFile);

    try {
      const res = await axios.post(`${API}/careers`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({ type: "ok", text: res.data.message });
      setFormData(emptyForm);
      setResumeFile(null);
      setSelectedPosition(null);
    } catch (err) {
      console.error("Career submission error:", err);
      setStatus({
        type: "error",
        text: "Failed to submit application. Please try again.",
      });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build your career with IHEM Forge"
        subtitle="Join a team of innovators across cloud, software, design and product, helping the next generation learn tech."
      />

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          {/* Result banner (stays visible after the modal closes) */}
          {status.text && !selectedPosition && (
            <p
              className={`mb-8 rounded-xl p-4 text-center font-semibold ${
                status.type === "ok"
                  ? "bg-green-50 text-green-800"
                  : status.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-forge-50 text-forge-800"
              }`}
            >
              {status.text}
            </p>
          )}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {openings.map((job) => (
              <article
                key={job.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-forge-100 bg-white shadow-card transition hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={job.image}
                    alt={job.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-bold">{job.title}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <span className="rounded-full bg-forge-50 px-3 py-0.5 text-xs font-bold text-forge-700">
                      {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} /> {job.location}
                    </span>
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {job.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => openForm(job)}
                    className="btn-primary mt-5 w-full"
                  >
                    Apply now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="bg-forge-50 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <span className="section-eyebrow">Our work</span>
          <h2 className="mt-4 text-3xl font-extrabold">Featured projects</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <figure
                key={project.id}
                className="overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="p-4 text-left font-display font-bold text-forge-950">
                  {project.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Application modal */}
      {selectedPosition && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forge-950/70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-8 shadow-card">
            <button
              type="button"
              onClick={() => setSelectedPosition(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:bg-forge-50 hover:text-forge-900"
            >
              <X size={22} />
            </button>
            <h2 className="pr-8 text-2xl font-extrabold">
              Apply for {selectedPosition.title}
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className={inputClass}
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={inputClass}
                required
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className={inputClass}
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows="3"
                className={inputClass}
              />
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-forge-950">
                  Resume
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={`${inputClass} !p-2 text-sm`}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Submit application
              </button>
            </form>
            {status.text && (
              <p
                className={`mt-4 rounded-xl p-3 text-center text-sm font-semibold ${
                  status.type === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-forge-50 text-forge-800"
                }`}
              >
                {status.text}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Careers;
