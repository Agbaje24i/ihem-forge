import React from "react";
import { FaBullseye, FaEye, FaHandsHelping, FaAward } from "react-icons/fa";

function About() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-white relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80')",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl text-center space-y-10">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          About IHEM Forge
        </h1>

        {/* Company Introduction */}
        <p className="text-lg md:text-xl leading-relaxed text-gray-200">
          IHEM Forge is a premier technology and training organization committed
          to empowering aspiring tech professionals with practical skills and
          knowledge. We specialize in cloud computing, software development,
          artificial intelligence, and digital innovation. Our goal is to bridge
          the gap between education and real-world industry requirements.
        </p>

        {/* Mission */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg flex items-start gap-4 backdrop-blur-sm">
          <FaBullseye size={40} className="text-blue-400 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-300">
              Our Mission
            </h2>
            <p className="text-gray-200">
              To provide top-quality technical education, mentorship, and
              hands-on projects that enable students and professionals to thrive
              in the rapidly evolving tech industry.
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg flex items-start gap-4 backdrop-blur-sm">
          <FaEye size={40} className="text-purple-400 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-purple-300">
              Our Vision
            </h2>
            <p className="text-gray-200">
              To become a leading technology academy recognized for producing
              highly skilled, industry-ready professionals capable of innovating
              and shaping the digital future.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg flex items-start gap-4 backdrop-blur-sm">
          <FaHandsHelping size={40} className="text-green-400 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-green-300">
              Our Core Values
            </h2>
            <ul className="list-disc list-inside text-gray-200 text-left space-y-1">
              <li>Excellence in Training and Mentorship</li>
              <li>Innovation and Creativity</li>
              <li>Integrity and Professionalism</li>
              <li>Collaboration and Community Growth</li>
              <li>Lifelong Learning and Adaptability</li>
            </ul>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg flex items-start gap-4 backdrop-blur-sm">
          <FaAward size={40} className="text-yellow-400 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-yellow-300">
              Our Journey & Achievements
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Since our inception, IHEM Forge has trained hundreds of students
              and professionals, successfully launching them into high-impact
              careers across tech companies and startups. Our alumni network
              continues to grow, and our programs are constantly updated to keep
              pace with emerging technologies and industry standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
