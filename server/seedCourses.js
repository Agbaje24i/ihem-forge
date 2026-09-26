import mongoose from "mongoose";
import Course from "./models/Course.js";

const courses = [
  {
    courseName: "Cloud Computing",
    description:
      "Learn Azure, AWS, and Google Cloud fundamentals, deployment, and management for enterprise-scale applications.",
    duration: "10 weeks",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80",
    status: "Active",
  },
  {
    courseName: "DevOps & CI/CD",
    description:
      "Master automation, containerization (Docker), orchestration (Kubernetes), and CI/CD pipelines.",
    duration: "12 weeks",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1350&q=80",
    status: "Active",
  },
  {
    courseName: "Web Development",
    description:
      "Full-stack web development with React, Node.js, HTML5, CSS3, JavaScript, and responsive design.",
    duration: "12 weeks",
    image:
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1350&q=80",
    status: "Active",
  },
  {
    courseName: "Mobile App Development",
    description:
      "Build Android and iOS apps using React Native, Flutter, or native tools.",
    duration: "10 weeks",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1350&q=80",
    status: "Active",
  },
  {
    courseName: "Data Science & AI",
    description:
      "Learn Python, machine learning, AI models, data analysis, and visualization.",
    duration: "14 weeks",
    image:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=1350&q=80",
    status: "Active",
  },
  {
    courseName: "UI/UX Design",
    description:
      "Learn user interface and user experience principles, and prototyping tools like Figma.",
    duration: "8 weeks",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80",
    status: "Active",
  },
  {
    courseName: "Networking & Infrastructure",
    description:
      "Learn servers, routing, switching, cloud networking, and IT infrastructure management.",
    duration: "10 weeks",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1350&q=80",
    status: "Active",
  },
  {
    courseName: "Cybersecurity",
    description:
      "Learn threat management, ethical hacking, and secure software development practices.",
    duration: "12 weeks",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1350&q=80",
    status: "Active",
  },
];

async function seed() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/certificates");
    console.log("✅ MongoDB Connected");

    for (const course of courses) {
      const existing = await Course.findOne({ courseName: course.courseName });

      if (existing) {
        console.log(`⏭  Skipping "${course.courseName}" — already exists`);
      } else {
        await Course.create(course);
        console.log(`✅ Added "${course.courseName}"`);
      }
    }

    console.log("🎉 Done seeding courses");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
