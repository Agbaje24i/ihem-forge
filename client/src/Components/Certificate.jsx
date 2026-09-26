import React, { useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import certLogo from "../assets/cert logo.png";
import "../styles/print.css";

const Certificate = () => {
  const { state } = useLocation();
  const certificateRef = useRef();

  const handlePrint = () => {
    const printContents = certificateRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate of Completion</title>
          <style>
            @page { size: A4 landscape; margin: 0; }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: 'Segoe UI', sans-serif;
              background: white;
              margin: 0;
              padding: 0;
            }
            .certificate-container {
              width: 297mm;
              height: 210mm;
              padding: 25mm;
              border: 10px solid #facc15;
              background: white;
              text-align: center;
              box-sizing: border-box;
            }
            img { display: block; margin: 0 auto 10px auto; }
            h1, h2, p { margin: 0 0 10px 0; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">⚠️ No certificate data found.</h2>
        <Link
          to="/certificate-form"
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
        >
          Go Back
        </Link>
      </div>
    );
  }

  const { name, course, date } = state;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50 p-6">
      <div
        ref={certificateRef}
        className="certificate-container relative bg-white border-[12px] border-yellow-500 rounded-xl shadow-2xl text-center p-10"
      >
        <img src={certLogo} alt="IHEM Forge Logo" className="w-32 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          IHEM Forge Tech Academy
        </h1>
        <p className="text-gray-600 italic mb-4">Official Certificate of Completion</p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          This is to certify that
        </h2>
        <h1 className="text-4xl font-extrabold text-yellow-600 mb-4">{name}</h1>
        <p className="text-gray-700 text-lg mb-3">
          has successfully completed the <strong>{course}</strong> program
        </p>
        <p className="text-gray-600 mb-6">
          on <strong>{new Date(date).toLocaleDateString()}</strong>
        </p>

        <div className="flex justify-between items-center mt-10 px-10">
          <div className="text-left">
            <p className="font-bold text-gray-700 border-t-2 border-gray-700 inline-block mt-4">
              Director of Training
            </p>
          </div>
          <QRCodeCanvas value={`IHEM Forge - ${name}`} size={80} />
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="mt-6 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
      >
        📥 Download / Print Certificate
      </button>

      <Link
        to="/certificate-form"
        className="mt-4 text-blue-700 font-semibold hover:underline"
      >
        ← Generate another certificate
      </Link>
    </div>
  );
};

export default Certificate;
