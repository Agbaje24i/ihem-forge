import React from "react";

const programs = [
  {
    title: "Cloud Computing",
    description:
      "Learn Azure, AWS, and Google Cloud fundamentals, deployment, and management for enterprise-scale applications.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80",
  },
  {
    title: "DevOps & CI/CD",
    description:
      "Master automation, containerization (Docker), orchestration (Kubernetes), and CI/CD pipelines.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1350&q=80",
  },
  {
    title: "Web Development",
    description:
      "Full-stack web development with React, Node.js, HTML5, CSS3, JavaScript, and responsive design.",
    image:
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1350&q=80",
  },
  {
    title: "Mobile App Development",
    description:
      "Build Android/iOS apps using React Native, Flutter, or native tools.",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1350&q=80",
  },
  {
    title: "Data Science & AI",
    description:
      "Learn Python, machine learning, AI models, data analysis, and visualization.",
    image:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=1350&q=80",
  },
  {
    title: "UI/UX Design",
    description:
      "Learn user interface, user experience principles, and prototyping tools like Figma.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80",
  },
  {
    title: "Networking & Infrastructure",
    description:
      "Learn servers, routing, switching, cloud networking, and IT infrastructure management.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1350&q=80",
  },
  {
    title: "Cybersecurity",
    description:
      "Learn threat management, ethical hacking, and secure software development practices.",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1350&q=80",
  },
];

function Programs() {
  return (
    <div className="min-h-screen bg-gray-100 py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Our Programs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {programs.map((program, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden shadow-lg h-96 flex flex-col justify-end text-white"
            style={{
              backgroundImage: `url(${program.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="relative p-6">
              <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
              <p className="text-sm">{program.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Programs;
