import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

import certLogo from "../assets/cert logo.png";

const API_URL = "http://localhost:5000";

const VerifyCertificate = () => {
  const { certId } = useParams();

  const [id, setId] = useState(certId || "");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);

  // ===========================
  // VERIFY CERTIFICATE
  // ===========================
  const verifyCertificate = async (certificateId) => {
    if (!certificateId) return;

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const res = await axios.get(
        `${API_URL}/certificate/${certificateId}`
      );

      setCertificate(res.data.certificate);
    } catch (err) {
      setError("❌ Certificate not found or invalid.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // AUTO VERIFY FROM URL
  // ===========================
  useEffect(() => {
    if (certId) {
      verifyCertificate(certId);
    }
  }, [certId]);

  // ===========================
  // QR CODE SCANNER
  // ===========================
  useEffect(() => {
    if (!scannerVisible) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();

        let scannedId = decodedText;

        // If QR contains a URL
        if (decodedText.includes("/")) {
          scannedId = decodedText.split("/").pop();
        }

        setId(scannedId);
        verifyCertificate(scannedId);
        setScannerVisible(false);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerVisible]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8,20,60,0.75), rgba(8,20,60,0.75)), url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-yellow-500 p-10 w-full max-w-2xl">

        <div className="flex flex-col items-center mb-8">

          <img
            src={certLogo}
            alt="IHEM Logo"
            className="w-24 h-24 mb-4"
          />

          <h1 className="text-4xl font-bold text-blue-900">
            Certificate Verification
          </h1>

          <p className="text-gray-600 text-center mt-2">
            Verify certificates issued by
            <br />
            <span className="font-semibold text-yellow-700">
              IHEM Forge Tech Academy
            </span>
          </p>

        </div>

        <div className="flex gap-3 mb-8">

          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />

          <button
            onClick={() => verifyCertificate(id)}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition"
          >
            Verify
          </button>

          <button
            onClick={() => setScannerVisible(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            📷 Scan QR
          </button>

        </div>

        {scannerVisible && (
          <div className="mb-6">
            <div id="reader"></div>
          </div>
        )}

        {loading && (
          <div className="text-center text-blue-700 font-semibold">
            Verifying certificate...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {certificate && (
          <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-8 mt-4">

            <div className="flex justify-center mb-6">

              <span className="bg-green-600 text-white px-6 py-2 rounded-full text-lg font-bold">
                ✅ VALID CERTIFICATE
              </span>

            </div>

            <div className="space-y-4 text-lg">

              <p><strong>Student:</strong> {certificate.name}</p>

              <p><strong>Course:</strong> {certificate.course}</p>

              <p><strong>Completion Date:</strong> {certificate.completionDate}</p>

              <p><strong>Certificate ID:</strong> {certificate.certId}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">
                  {certificate.status}
                </span>
              </p>

            </div>

          </div>
        )}

        <div className="mt-10 border-t pt-6 text-center">

          <p className="text-gray-500 text-sm">
            Issued and verified by
          </p>

          <h3 className="font-bold text-yellow-700 text-lg mt-1">
            IHEM Forge Tech Academy
          </h3>

          <p className="text-xs text-gray-400 mt-2">
            Excellence • Innovation • Integrity
          </p>

        </div>

      </div>
    </div>
  );
};

export default VerifyCertificate;