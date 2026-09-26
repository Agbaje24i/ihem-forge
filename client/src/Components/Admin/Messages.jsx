import React, { useEffect, useState } from "react";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const [showView, setShowView] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // ======================
  // LOAD MESSAGES
  // ======================

  const loadMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/contact");
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // ======================
  // DELETE MESSAGE
  // ======================

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await fetch(`http://localhost:5000/contact/${id}`, {
        method: "DELETE",
      });

      loadMessages();
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
            "url('https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "250px",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 p-10 text-white flex flex-col justify-center h-full">
          <h1 className="text-5xl font-bold">
            Messages
          </h1>

          <p className="text-xl mt-3">
            View and manage messages submitted through the contact form.
          </p>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <input
          type="text"
          placeholder="Search messages..."
          className="w-full border rounded-lg p-3 mb-6"
        />

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {messages.length === 0 ? (

              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  No messages found.
                </td>
              </tr>

            ) : (

              messages.map((item) => (

                <tr key={item._id} className="border-b hover:bg-gray-50">

                  <td className="p-3">
                    {item.fullName || item.name}
                  </td>

                  <td className="p-3">
                    {item.email}
                  </td>

                  <td className="p-3">
                    {item.subject}
                  </td>

                  <td className="p-3">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3 text-center space-x-2">

                    <button
                      onClick={() => {
                        setSelectedMessage(item);
                        setShowView(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteMessage(item._id)}
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

      {/* View Message Popup */}

      {showView && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

          <div className="bg-white w-[550px] rounded-xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-6">
              Message Details
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Name:</strong>{" "}
                {selectedMessage.fullName || selectedMessage.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedMessage.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedMessage.phone}
              </p>

              <p>
                <strong>Subject:</strong>{" "}
                {selectedMessage.subject}
              </p>

              <p>
                <strong>Message:</strong>{" "}
                {selectedMessage.message}
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

export default Messages;
