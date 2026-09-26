import React, { useState } from "react";
import axios from "axios";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

// ✅ Import your local images (make sure they exist in /src/assets)
import leadPhoto from "../assets/lead.jpg";
import instructorPhoto from "../assets/instructor.jpg";

// ✅ Optional: online fallback background (always works)
const bgImage =
  "https://images.unsplash.com/photo-1522205408450-add114ad53fe?auto=format&fit=crop&w=1920&q=80";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post("http://localhost:5000/contact", formData);
      setStatus(res.data.message);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Failed to send message. Please try again.");
    }
  };

  return (
    <section
      className="bg-cover bg-center py-16 px-6 md:px-12"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          Contact Us
        </h2>

        {/* Contact Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Programme Lead */}
          <div className="bg-white shadow-md p-6 rounded-2xl hover:shadow-lg transition duration-300 text-center">
            <img
              src={leadPhoto || "https://via.placeholder.com/200x200?text=Lead"}
              alt="Programme Lead"
              className="w-40 h-40 rounded-full mx-auto mb-4 object-cover shadow-md"
            />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              Programme Lead
            </h3>
            <p className="text-gray-800 font-medium mb-2">
              Engr. Akinnadeju Bukky F
            </p>
            <p className="flex items-center justify-center text-gray-600 mb-1">
              <FaPhoneAlt className="text-blue-500 mr-2" /> +2348130620238
            </p>
            <p className="flex items-center justify-center text-gray-600">
              <FaEnvelope className="text-blue-500 mr-2" /> Bukky.akinnadeju17@gmail.com
            </p>
          </div>

          {/* Programme Instructor */}
          <div className="bg-white shadow-md p-6 rounded-2xl hover:shadow-lg transition duration-300 text-center">
            <img
              src={instructorPhoto || "https://via.placeholder.com/200x200?text=Instructor"}
              alt="Programme Instructor"
              className="w-40 h-40 rounded-full mx-auto mb-4 object-cover shadow-md"
            />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              Programme Instructor
            </h3>
            <p className="text-gray-800 font-medium mb-2">Agbaje Isaac A</p>
            <p className="flex items-center justify-center text-gray-600 mb-1">
              <FaPhoneAlt className="text-blue-500 mr-2" /> +2348142723736
            </p>
            <p className="flex items-center justify-center text-gray-600">
              <FaEnvelope className="text-blue-500 mr-2" /> adebisiisaac1@gmail.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
            Send Us a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Message</label>
              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
            >
              Send Message
            </button>
          </form>

          {status && (
            <p className="mt-4 text-center text-gray-700 font-medium">{status}</p>
          )}
        </div>

        {/* Google Map */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
            Our Location
          </h3>
          <div className="w-full h-96 rounded-2xl overflow-hidden shadow-md">
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
  );
};

export default Contact;
