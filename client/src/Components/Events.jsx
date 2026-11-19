import React, { useState, useEffect } from "react";
import { CalendarDays, X } from "lucide-react";
import PageHeader from "./PageHeader";
import { inputClass } from "./AuthShell";
import { API } from "../api";


// TODO: replace with your real upcoming events (dates in the past show as "Completed")
const initialEvents = [
  {
    id: 1,
    title: "DevOps Bootcamp",
    date: "2025-10-20T10:00:00",
    category: "Bootcamp",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1350&q=80",
    tags: ["Cloud", "DevOps", "Free"],
  },
  {
    id: 2,
    title: "Mobile App Hackathon",
    date: "2025-11-05T14:00:00",
    category: "Hackathon",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    tags: ["Mobile", "Coding", "Online"],
  },
  {
    id: 3,
    title: "UI/UX Workshop",
    date: "2025-12-01T09:00:00",
    category: "Workshop",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80",
    tags: ["Design", "UI/UX", "Paid"],
  },
];

function EventCard({ event, onRegister }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(event.date) - new Date();

      if (diff <= 0) {
        setStarted(true);
        setTimeLeft("");
        return true;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setStarted(false);
      setTimeLeft(`Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`);
      return false;
    };

    if (tick()) return undefined;
    const interval = setInterval(() => {
      if (tick()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  return (
    <article className="overflow-hidden rounded-2xl border border-forge-100 bg-white shadow-card transition hover:-translate-y-1">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-forge-700">
          {event.category}
        </span>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays size={16} className="text-forge-500" />
          {new Date(event.date).toLocaleString()}
        </p>
        <p
          className={`mt-2 text-sm font-semibold ${
            started ? "text-slate-500" : "text-ember-600"
          }`}
        >
          {started ? "Completed" : timeLeft}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-forge-50 px-3 py-1 text-xs font-semibold text-forge-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onRegister(event)}
          disabled={started}
          className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {started ? "Registration closed" : "Register"}
        </button>
      </div>
    </article>
  );
}

function Events() {
  const [events] = useState(initialEvents);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState({ type: "", text: "" });

  const categories = ["All", "Bootcamp", "Workshop", "Hackathon"];

  const filteredEvents =
    filter === "All" ? events : events.filter((event) => event.category === filter);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setSuccess({ type: "", text: "" });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/register-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventTitle: selectedEvent.title, ...formData }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess({ type: "ok", text: "Successfully registered for the event!" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSuccess({ type: "error", text: data.message || "Something went wrong." });
      }
    } catch (err) {
      setSuccess({ type: "error", text: "Server not running or request failed." });
      console.error("Event submission error:", err);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Bootcamps, workshops and hackathons"
        subtitle="Learn something new, meet the community and build with others."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === cat
                    ? "bg-forge-600 text-white shadow-glow"
                    : "bg-forge-50 text-forge-800 hover:bg-forge-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onRegister={handleRegisterClick} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forge-950/70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-card">
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:bg-forge-50 hover:text-forge-900"
            >
              <X size={22} />
            </button>
            <h2 className="pr-8 text-2xl font-extrabold">
              Register for {selectedEvent.title}
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={inputClass}
              />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className={inputClass}
              />
              <textarea
                placeholder="Message (optional)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="3"
                className={inputClass}
              />
              <button type="submit" className="btn-primary w-full">
                Submit
              </button>
            </form>
            {success.text && (
              <p
                className={`mt-4 rounded-xl p-3 text-sm font-semibold ${
                  success.type === "ok"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {success.text}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Events;
