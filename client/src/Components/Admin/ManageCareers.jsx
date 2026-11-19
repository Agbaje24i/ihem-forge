import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../api";

const ManageCareers = () => {
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", location: "" });
  const [loading, setLoading] = useState(false);

  const fetchCareers = async () => {
    try {
      const res = await axios.get(`${API}/career`);
      setCareers(res.data);
    } catch (err) {
      console.error("Error fetching careers:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/career`, form);
      alert("Career added successfully!");
      setForm({ title: "", description: "", location: "" });
      fetchCareers();
    } catch (err) {
      alert("Failed to add career");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this career?")) return;
    try {
      await axios.delete(`${API}/career/${id}`);
      fetchCareers();
    } catch (err) {
      alert("Failed to delete career");
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="bg-black/70 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Careers</h1>

        {/* Add New Career Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 p-6 rounded-xl mb-8 grid md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Job Title"
            className="p-3 rounded-md text-black"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="p-3 rounded-md text-black"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="p-3 rounded-md text-black col-span-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded-md col-span-full"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Career"}
          </button>
        </form>

        {/* Career List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.length > 0 ? (
            careers.map((career) => (
              <div
                key={career._id}
                className="bg-white/20 p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-xl font-semibold">{career.title}</h2>
                <p className="text-gray-200 mt-2">{career.description}</p>
                <p className="text-sm mt-2 text-gray-300">
                  📍 {career.location}
                </p>
                <button
                  onClick={() => handleDelete(career._id)}
                  className="mt-4 bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-300">
              No careers available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCareers;
