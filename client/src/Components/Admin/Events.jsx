import React, { useEffect, useState } from "react";

const Events = () => {
  const [events, setEvents] = useState([]);

  const [showView, setShowView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ======================
  // LOAD EVENT REGISTRATIONS
  // ======================

  const loadEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/register-event"
      );
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ======================
  // DELETE EVENT REGISTRATION
  // ======================

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this registration?")) return;

    try {
      await fetch(`http://localhost:5000/register-event/${id}`, {
        method: "DELETE",
      });

      loadEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* Hero Banner */}

      <div
        className="relative rounded-xl overflow-hidden shadow-lg mb-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "250px",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 p-10 text-white flex flex-col justify-center h-full">
          <h1 className="text-5xl font-bold">
            Events
          </h1>

          <p className="text-xl mt-3">
            Manage event registrations submitted by attendees.
          </p>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <input
          type="text"
          placeholder="Search registrations..."
          className="w-full border rounded-lg p-3 mb-6"
        />

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {events.length === 0 ? (

              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  No event registrations found.
                </td>
              </tr>

            ) : (

              events.map((item) => (

                <tr key={item._id} className="border-b hover:bg-gray-50">

                  <td className="p-3">
                    {item.fullName || item.name}
                  </td>

                  <td className="p-3">
                    {item.email}
                  </td>

                  <td className="p-3">
                    {item.eventName || item.event}
                  </td>

                  <td className="p-3">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3 text-center space-x-2">

                    <button
                      onClick={() => {
                        setSelectedEvent(item);
                        setShowView(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteEvent(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* View Event Registration Popup */}

      {showView && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

          <div className="bg-white w-[550px] rounded-xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-6">
              Registration Details
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Full Name:</strong>{" "}
                {selectedEvent.fullName || selectedEvent.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedEvent.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedEvent.phone}
              </p>

              <p>
                <strong>Event:</strong>{" "}
                {selectedEvent.eventName || selectedEvent.event}
              </p>

            </div>

            <div className="flex justify-end mt-8">

              <button
                onClick={() => setShowView(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
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

export default Events;
