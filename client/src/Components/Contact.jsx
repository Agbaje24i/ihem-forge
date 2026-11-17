import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone } from "lucide-react";
import PageHeader from "./PageHeader";
import { inputClass } from "./AuthShell";

// Local images (make sure they exist in /src/assets)
import leadPhoto from "../assets/lead.jpg";
import instructorPhoto from "../assets/instructor.jpg";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const team = [
  {
    role: "Programme Lead",
    name: "Engr. Akinnadeju Bukky F",
    phone: "+2348130620238",
    email: "Bukky.akinnadeju17@gmail.com",
    photo: leadPhoto,
  },
  {
    role: "Programme Instructor",
    name: "Agbaje Isaac A",
    phone: "+2348142723736",
    email: "adebisiisaac1@gmail.com",
    photo: instructorPhoto,
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", text: "" });

    try {
      const res = await axios.post(`${API}/contact`, formData);
      setStatus({ type: "ok", text: res.data.message });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        text: "Failed to send message. Please try again.",
      });
    }
    setSending(false);
  };

  const label = "mb-1.5 block text-sm font-semibold text-forge-950";

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to our team"
        subtitle="Questions about a track, applications or scholarships? We would love to hear from you."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          {/* Team */}
          <div className="grid gap-6 md:grid-cols-2">
            {team.map((p) => (
              <div
                key={p.role}
                className="rounded-3xl border border-forge-100 bg-white p-8 text-center shadow-card"
              >
                <img
                  src={p.photo}
                  alt={p.role}
                  className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-forge-100"
                />
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-forge-500">
                  {p.role}
                </p>
                <h2 className="mt-1 text-xl font-extrabold">{p.name}</h2>
                <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600">
                  <Phone size={15} className="text-forge-500" /> {p.phone}
                </p>
                <p className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-600">
                  <Mail size={15} className="text-forge-500" /> {p.email}
                </p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-forge-100 bg-white p-8 shadow-card md:p-10">
            <h2 className="text-2xl font-extrabold">Send us a message</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className={label}>Full name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className={label}>Email address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className={label}>Message</label>
                <textarea
                  id="message"
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message..."
                  className={inputClass}
                  required
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>

            {status.text && (
              <p
                className={`mt-4 rounded-xl p-3 text-center text-sm font-medium ${
                  status.type === "ok"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.text}
              </p>
            )}
          </div>

          {/* Map */}
          <div className="mt-14">
            <h2 className="mb-5 text-center text-2xl font-extrabold">Our location</h2>
            <div className="h-96 w-full overflow-hidden rounded-3xl border border-forge-100 shadow-card">
              <iframe
                title="IHEM Forge Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.221225349041!2d7.600049874864424!3d9.064330791023532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0a54e1b5df73%3A0x986b4e5a5457c9b3!2sAbuja%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1698619889176!5m2!1sen!2sng"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                className="border-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
