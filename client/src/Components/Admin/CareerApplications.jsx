import React, { useEffect, useState } from "react";
import { API } from "../../api";


const CareerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showView, setShowView] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // ======================
  // LOAD CAREER APPLICATIONS
  // ======================

  const loadApplications = async () => {
    try {
      const response = await fetch(`${API}/careers`);
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // ======================
  // APPROVE APPLICATION
  // ======================

  const approveApplication = async (item) => {
    const ok = window.confirm(`Approve ${item.name}'s application?`);
    if (!ok) return;

    try {
      const response = await fetch(`${API}/careers/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (response.ok) {
        alert("Application Approved");
        setApplications((prev) =>
          prev.map((app) =>
            app._id === item._id ? { ...app, status: "Approved" } : app
          )
        );
        if (selectedApplication && selectedApplication._id === item._id) {
          setSelectedApplication({ ...selectedApplication, status: "Approved" });
        }
      } else {
        alert("Failed to approve application");
      }
    } catch (err) {
      console.log(err);
      alert("Server Connection Error");
    }
  };

  // ======================
  // REJECT APPLICATION
  // ======================

  const rejectApplication = async (item) => {
    const ok = window.confirm(`Reject ${item.name}'s application?`);
    if (!ok) return;

    try {
      const response = await fetch(`${API}/careers/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      });

      if (response.ok) {
        alert("Application Rejected");
        setApplications((prev) =>
          prev.map((app) =>
            app._id === item._id ? { ...app, status: "Rejected" } : app
          )
        );
        if (selectedApplication && selectedApplication._id === item._id) {
          setSelectedApplication({ ...selectedApplication, status: "Rejected" });
        }
      } else {
        alert("Failed to reject application");
      }
    } catch (err) {
      console.log(err);
      alert("Server Connection Error");
    }
  };

  // ======================
  // DELETE APPLICATION
  // ======================

  const deleteApplication = async (item) => {
    const ok = window.confirm(
      `Delete ${item.name}'s application? This cannot be undone.`
    );
    if (!ok) return;

    try {
      const response = await fetch(`${API}/careers/${item._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Application Deleted");
        setShowView(false);
        loadApplications();
      } else {
        alert("Failed to delete application");
      }
    } catch (err) {
      console.log(err);
      alert("Server Connection Error");
    }
  };

  // ======================
  // SEARCH / FILTER
  // ======================

  const filteredApplications = applications.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.position?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Hero Banner */}

      <div
        className="relative rounded-xl overflow-hidden shadow-lg mb-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "250px",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 p-10 text-white flex flex-col justify-center h-full">
          <h1 className="text-5xl font-bold">
            Career Applications
          </h1>

          <p className="text-xl mt-3">
            Review job applications and download submitted resumes.
          </p>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <input
          type="text"
          placeholder="Search by name, position, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        {loading ? (

          <p>Loading applications...</p>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Position</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Resume</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredApplications.length === 0 ? (

                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    No career applications found.
                  </td>
                </tr>

              ) : (

                filteredApplications.map((item) => (

                  <tr key={item._id} className="border-b hover:bg-gray-50">

                    <td className="p-3">{item.name}</td>

                    <td className="p-3">{item.position}</td>

                    <td className="p-3">{item.email}</td>

                    <td className="p-3">
                      {item.resume ? (
                        <a
                          href={`${API}/${item.resume.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Download
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          item.status === "Approved"
                            ? "bg-green-600"
                            : item.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3 text-center space-x-2">

                      <button
                        onClick={() => {
                          setSelectedApplication(item);
                          setShowView(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() => approveApplication(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectApplication(item)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => deleteApplication(item)}
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

        )}

      </div>

      {/* View Application Popup */}

      {showView && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

          <div className="bg-white w-[550px] rounded-xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-6">
              Application Details
            </h2>

            <div className="space-y-3">

              <p><strong>Name:</strong> {selectedApplication.name}</p>

              <p><strong>Email:</strong> {selectedApplication.email}</p>

              <p><strong>Phone:</strong> {selectedApplication.phone}</p>

              <p><strong>Position:</strong> {selectedApplication.position}</p>

              <p><strong>Message:</strong> {selectedApplication.message || "-"}</p>

              <p>
                <strong>Resume:</strong>{" "}
                {selectedApplication.resume ? (
                  <a
                    href={`${API}/${selectedApplication.resume.replace(/\\/g, "/")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download Resume
                  </a>
                ) : (
                  "-"
                )}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    selectedApplication.status === "Approved"
                      ? "bg-green-600"
                      : selectedApplication.status === "Rejected"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {selectedApplication.status}
                </span>
              </p>

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => approveApplication(selectedApplication)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Approve
              </button>

              <button
                onClick={() => rejectApplication(selectedApplication)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              >
                Reject
              </button>

              <button
                onClick={() => deleteApplication(selectedApplication)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

              <button
                onClick={() => setShowView(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
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

export default CareerApplications;
