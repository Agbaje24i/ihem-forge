import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { BadgeCheck, QrCode } from "lucide-react";
import { inputClass } from "./AuthShell";

import certLogo from "../assets/cert logo.png";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
      const res = await axios.get(`${API_URL}/certificate/${certificateId}`);
      setCertificate(res.data.certificate);
    } catch (err) {
      setError("Certificate not found or invalid.");
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
      { fps: 10, qrbox: { width: 250, height: 250 } },
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
    <div className="min-h-screen bg-gradient-to-b from-forge-50 to-white px-6 pb-20 pt-32">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-forge-100 bg-white p-8 shadow-card sm:p-10">
        <div className="flex flex-col items-center text-center">
          <img src={certLogo} alt="IHEM Logo" className="mb-4 h-20 w-20 object-contain" />
          <h1 className="text-3xl font-extrabold sm:text-4xl">Certificate verification</h1>
          <p className="mt-2 text-slate-600">
            Verify certificates issued by{" "}
            <span className="font-semibold text-forge-700">IHEMFORGE Academy</span>
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Enter certificate ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className={`${inputClass} flex-1`}
          />
          <button type="button" onClick={() => verifyCertificate(id)} className="btn-primary">
            Verify
          </button>
          <button
            type="button"
            onClick={() => setScannerVisible(true)}
            className="btn-outline"
          >
            <QrCode size={18} /> Scan QR
          </button>
        </div>

        {scannerVisible && (
          <div className="mt-6">
            <div id="reader"></div>
          </div>
        )}

        {loading && (
          <p className="mt-6 text-center font-semibold text-forge-700">
            Verifying certificate...
          </p>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {certificate && (
          <div className="mt-6 rounded-2xl border-2 border-green-300 bg-green-50 p-6 sm:p-8">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 font-bold text-white">
                <BadgeCheck size={20} /> Valid certificate
              </span>
            </div>

            <dl className="mt-6 space-y-3 text-base">
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-600">Student</dt>
                <dd className="text-right font-bold text-forge-950">{certificate.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-600">Course</dt>
                <dd className="text-right font-bold text-forge-950">{certificate.course}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-600">Completion date</dt>
                <dd className="text-right font-bold text-forge-950">{certificate.completionDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-600">Certificate ID</dt>
                <dd className="text-right font-bold text-forge-950">{certificate.certId}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-semibold text-slate-600">Status</dt>
                <dd>
                  <span className="rounded-full bg-green-600 px-4 py-1 text-sm font-bold text-white">
                    {certificate.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-10 border-t border-forge-100 pt-6 text-center">
          <p className="text-sm text-slate-500">Issued and verified by</p>
          <p className="mt-1 font-display text-lg font-bold text-forge-700">
            IHEMFORGE Academy
          </p>
          <p className="mt-2 text-xs text-slate-400">Excellence • Innovation • Integrity</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
