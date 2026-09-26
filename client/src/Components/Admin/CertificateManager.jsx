import React, { useEffect, useState } from "react";

const API = "http://localhost:5000";

const CertificateManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Controls the "View Certificate" popup
  const [showView, setShowView] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const res = await fetch(`${API}/certificates`);
      const data = await res.json();
      setCertificates(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const deleteCertificate = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!ok) return;

    await fetch(`${API}/certificate/${id}`, {
      method: "DELETE",
    });

    loadCertificates();
  };

  const filteredCertificates = certificates.filter((cert) => {
    return (
      cert.name.toLowerCase().includes(search.toLowerCase()) ||
      cert.certId.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          Certificate Manager
        </h2>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72"
        />

      </div>

      {loading ? (

        <p>Loading certificates...</p>

      ) : (

        <table className="w-full border">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3">Certificate ID</th>

              <th className="p-3">Student</th>

              <th className="p-3">Course</th>

              <th className="p-3">Date</th>

              <th className="p-3">Status</th>

              <th className="p-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredCertificates.map((cert)=>(
              <tr
                key={cert._id}
                className="border-b text-center"
              >

                <td>{cert.certId}</td>

                <td>{cert.name}</td>

                <td>{cert.course}</td>

                <td>{cert.completionDate}</td>

                <td>

                  <span className="bg-green-600 text-white px-3 py-1 rounded-full">

                    {cert.status}

                  </span>

                </td>

                <td>

                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    onClick={()=>{
                      setSelectedCertificate(cert);
                      setShowView(true);
                    }}
                  >
                    View
                  </button>

                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={()=>deleteCertificate(cert._id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      )}

      {/* View Certificate Popup */}

      {showView && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

          <div className="bg-white w-[500px] rounded-xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Certificate Details
            </h2>

            <p><strong>Certificate ID:</strong> {selectedCertificate.certId}</p>
            <p><strong>Student:</strong> {selectedCertificate.name}</p>
            <p><strong>Course:</strong> {selectedCertificate.course}</p>
            <p><strong>Completion Date:</strong> {selectedCertificate.completionDate}</p>
            <p><strong>Status:</strong> {selectedCertificate.status}</p>
            <p className="break-all"><strong>Hash:</strong> {selectedCertificate.hash}</p>
            <p><strong>Created At:</strong> {selectedCertificate.createdAt}</p>
            <p><strong>Updated At:</strong> {selectedCertificate.updatedAt}</p>

            <div className="flex justify-end mt-6">

              <button
                onClick={() => setShowView(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded"
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

export default CertificateManager;
