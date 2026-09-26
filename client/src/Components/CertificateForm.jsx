import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import certLogo from "../assets/cert logo.png";
import signature from "../assets/Signature.png";
import stamp from "../assets/Stamp.png";

const CertificateForm = () => {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef();

  const formatDate = (value) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(value).toLocaleDateString("en-US", options);
  };

  
 const handleGenerateCertificate = async (e) => {
  e.preventDefault();

  if (!name || !course || !date) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/certificate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        course,
        completionDate: formatDate(date),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

   const cert = data.certificate || data;

setCertificateId(cert.certId);
setShowCertificate(true);
    console.log("Certificate Saved:", data);
  } catch (error) {
    console.error(error);
    alert("Failed to generate certificate.");
  }
};
  // Prevent PDF cutoff
  const handleDownloadPDF = async () => {
    const certificateElement = certificateRef.current;
    if (!certificateElement) return;

    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${name}_certificate.pdf`);
  };

  return (
  <div
    className="min-h-screen flex flex-col items-center justify-center p-6"
    style={{
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    }}
  >
      {!showCertificate ? (
        <form
          onSubmit={handleGenerateCertificate}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-yellow-700">
            Generate Your Certificate
          </h2>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Full Name</span>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Course</span>
            <input
              type="text"
              placeholder="Enter your course name"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">Date</span>
            <input
              type="date"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Generate Certificate
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center">
          <div
            ref={certificateRef}
            id="certificate"
            className="relative bg-white border-[16px] border-yellow-600 rounded-xl w-[1120px] h-[820px] p-12 pb-32 flex flex-col items-center text-center shadow-xl overflow-hidden"
            style={{
              boxShadow:
                "0 0 30px rgba(255, 215, 0, 0.8), inset 0 0 15px rgba(255, 215, 0, 0.5)",
            }}
          >
            {/* ✅ Multiple Watermark Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="grid grid-cols-2 gap-20 w-full h-full place-items-center opacity-10">
                {Array.from({ length: 10 }).map((_, index) => (
                  <h1
                    key={index}
                    className="text-4xl font-bold text-yellow-700 tracking-widest"
                    style={{
                      transform: "rotate(-35deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    IHEM FORGE TECH ACADEMY
                  </h1>
                ))}
              </div>
            </div>

            {/* ✅ Bigger Logo Above Title */}
            <img
              src={certLogo}
              alt="Certificate Logo"
              className="w-36 h-36 object-contain mb-6 relative z-10"
            />

            {/* Title */}
            <h1 className="text-5xl font-extrabold text-yellow-700 relative z-10">
              Certificate of Completion
            </h1>

            {/* Subtitle */}
            <p className="text-gray-700 italic text-xl mt-3 relative z-10">
              This is to proudly certify that
            </p>

            {/* Name */}
            <h2 className="text-4xl font-bold text-gray-900 underline mt-4 mb-4 relative z-10">
              {name}
            </h2>

            <p className="text-xl text-gray-700 mb-4 relative z-10">
              has successfully completed the course
            </p>

            <h3 className="text-3xl font-bold text-yellow-700 mb-6 relative z-10">
              {course}
            </h3>

            <p className="text-lg text-gray-700 mb-2 relative z-10">
              Awarded on: <strong>{formatDate(date)}</strong>
            </p>

            <p className="text-sm text-gray-600 italic mt-2 mb-6 relative z-10">
              Certificate ID: <strong>{certificateId}</strong>
            </p>

            {/* QR Code */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
              <QRCodeCanvas
  value={`http://localhost:3000/verify/${certificateId}`}
  size={110}
  bgColor="#ffffff"
  fgColor="#000000"
  level="H"
  includeMargin={true}
/>
            </div>

            {/* Signature Row */}
            <div className="absolute bottom-10 w-full flex justify-between px-20 z-10">
              <div className="text-center">
                <img
                  src={signature}
                  alt="Signature"
                  className="w-40 h-24 object-contain mx-auto"
                />
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  Engr. Bukola Akinnadeju F.
                </p>
                <p className="text-xs text-gray-500">Director of Training</p>
              </div>

              <div className="text-center">
                <img
                  src={stamp}
                  alt="Stamp"
                  className="w-24 h-24 object-contain mx-auto"
                />
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  Official Stamp
                </p>
              </div>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownloadPDF}
            className="mt-10 bg-yellow-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificateForm;
