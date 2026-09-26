import React, { useState, useEffect } from "react";

// Sample event data
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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const diff = eventDate - now;

      if (diff <= 0) {
        setTimeLeft("Event Started");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 relative">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
        <p className="text-gray-600 mb-2">
          Date: {new Date(event.date).toLocaleString()}
        </p>
        <p className="text-blue-500 font-semibold mb-2">{timeLeft}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => onRegister(event)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}

function Events() {
  const [events] = useState(initialEvents);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");

  const categories = ["All", "Bootcamp", "Workshop", "Hackathon"];

  const filteredEvents =
    filter === "All" ? events : events.filter((event) => event.category === filter);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setSuccess("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventTitle: selectedEvent.title, ...formData }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("✅ Successfully registered for the event!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSuccess("❌ " + (data.message || "Something went wrong."));
      }
    } catch (err) {
      setSuccess("⚠️ Server not running or request failed.");
      console.error("Event submission error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-8">Upcoming Events</h1>

      {/* Category Filters */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-medium ${
              filter === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} onRegister={handleRegisterClick} />
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              Register for {selectedEvent.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 h-24"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Submit
              </button>
            </form>
            {success && <p className="mt-4 text-green-600 font-semibold">{success}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
