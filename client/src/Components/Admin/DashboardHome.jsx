import React from "react";

const DashboardHome = () => {
  return (
    <div>

      {/* Welcome Banner */}
      <div
        className="relative rounded-xl overflow-hidden shadow-lg mb-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "350px",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to IHEM Forge Admin Portal 👋
          </h1>

          <p className="text-xl max-w-3xl">
            Manage students, certificates, courses, applications,
            events and messages from one place.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold">Certificates</h2>
          <p className="text-5xl font-bold mt-4">0</p>
        </div>

        <div className="bg-green-600 text-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-5xl font-bold mt-4">0</p>
        </div>

        <div className="bg-purple-600 text-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold">Applications</h2>
          <p className="text-5xl font-bold mt-4">0</p>
        </div>

        <div className="bg-yellow-500 text-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold">Messages</h2>
          <p className="text-5xl font-bold mt-4">0</p>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;