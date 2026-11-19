import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import Certificate from "./models/Certificate.js";
import Student from "./models/Student.js";
import Course from "./models/Course.js";
import Application from "./models/Application.js";
import Cohort from "./models/Cohort.js";
import { APPLICATION_STATUSES } from "./lib/finance.js";

import careerRoutes from "./routes/careerRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import academyRoutes from "./routes/academyRoutes.js";
import {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  ADMIN_JWT_SECRET,
  requireAdmin,
} from "./auth.js";

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded resumes so admin can open/download them
app.use("/uploads", express.static("uploads"));

// Career (job) applications, Event registrations, and Student auth live in their own route files
app.use("/", careerRoutes);
app.use("/", eventRoutes);
app.use("/", studentAuthRoutes);
app.use("/", contactRoutes);
app.use("/", academyRoutes);

// ======================
// CONNECT TO MONGODB
// ======================

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/certificates")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// ======================
// HOME ROUTE
// ======================

app.get("/", (req, res) => {
  res.send("IHEM Forge Certificate API Running...");
});

// ======================
// ADMIN LOGIN
// ======================

// Credentials and secrets come from server/auth.js (set them in server/.env)
const JWT_SECRET = ADMIN_JWT_SECRET;

app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (
    username !== ADMIN_USERNAME ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      username,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  res.json({
    token,
    message: "Login successful",
  });
});

// ======================
// CREATE CERTIFICATE
// ======================

app.post("/certificate", async (req, res) => {
  try {
    const { name, course, completionDate } = req.body;

    if (!name || !course || !completionDate) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    const certId = `CERT-AEG-2026-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const hash = crypto
      .createHash("sha256")
      .update(certId + name + course + completionDate)
      .digest("hex");

    const certificate = await Certificate.create({
      certId,
      name,
      course,
      completionDate,
      status: "VALID",
      hash,
    });

    console.log("Certificate Saved:", certificate.certId);

    res.status(201).json(certificate);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });

  }
});

// ======================
// VERIFY CERTIFICATE
// ======================

app.get("/certificate/:certId", async (req, res) => {
  try {

    const certificate = await Certificate.findOne({
      certId: req.params.certId.trim(),
    });

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        message: "Certificate not found",
      });
    }

    const verifyHash = crypto
      .createHash("sha256")
      .update(
        certificate.certId +
          certificate.name +
          certificate.course +
          certificate.completionDate
      )
      .digest("hex");

    if (verifyHash !== certificate.hash) {
      return res.status(403).json({
        valid: false,
        message: "Certificate has been tampered with",
      });
    }

    res.json({
      valid: true,
      certificate,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });

  }
});

// ======================
// GET ALL CERTIFICATES
// ======================

app.get("/certificates", async (req, res) => {
  try {

    const certificates = await Certificate.find().sort({
      createdAt: -1,
    });

    res.json(certificates);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });

  }
});

// ======================
// UPDATE CERTIFICATE
// ======================

app.put("/certificate/:id", async (req, res) => {
  try {

    const updatedCertificate =
      await Certificate.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(updatedCertificate);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });

  }
});

// ======================
// DELETE CERTIFICATE
// ======================

app.delete("/certificate/:id", async (req, res) => {
  try {

    await Certificate.findByIdAndDelete(req.params.id);

    res.json({
      message: "Certificate deleted successfully.",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });

  }
});

// ======================
// STUDENTS API
// ======================

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Add new student
app.post("/students", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      course,
    } = req.body;

    const student = await Student.create({
      studentId: `STU${Date.now()}`,
      fullName,
      email,
      phone,
      gender,
      course,
      status: "Active",
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Update student
app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(student);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================
// COURSES API
// ======================

// Get all courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Add new course
app.post("/courses", async (req, res) => {
  try {
    const {
      courseName,
      description,
      duration,
      status,
    } = req.body;

    const course = await Course.create({
      courseName,
      description,
      duration,
      status: status || "Active",
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Update course
app.put("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(course);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Delete course
app.delete("/courses/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      message: "Course deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================
// APPLICATIONS API (course / admission applications)
// ======================

// Get all applications (admin only - contains applicants' personal details)
app.get("/apply", requireAdmin, async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Submit new application (accepts either "fullName" or "name" from different forms)
app.post("/apply", async (req, res) => {
  try {
    const {
      fullName,
      name,
      email,
      phone,
      course,
      gender,
      qualification,
      learningMode,
      experienceLevel,
      supportNeeded,
      message,
      cohortId,
    } = req.body;

    // Optional cohort: must exist, be open and belong to the chosen track
    let cohort = null;
    if (cohortId) {
      cohort = mongoose.isValidObjectId(cohortId)
        ? await Cohort.findById(cohortId)
        : null;

      if (!cohort) {
        return res.status(400).json({ message: "Selected cohort was not found" });
      }
      if (cohort.status !== "Open") {
        return res
          .status(400)
          .json({ message: "Applications for this cohort are closed" });
      }
      if (course && cohort.track !== course) {
        return res
          .status(400)
          .json({ message: "That cohort is for a different track" });
      }
    }

    const application = await Application.create({
      applicationId: `APP${Date.now()}`,
      cohort: cohort ? cohort._id : undefined,
      cohortName: cohort ? cohort.name : "",
      fullName: fullName || name,
      email,
      phone,
      course,
      gender,
      qualification,
      learningMode,
      experienceLevel,
      supportNeeded,
      message,
      status: "Pending",
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Review an application (admin only): status, scholarship %, note, cohort.
// Only these fields can be changed, and approving respects the cohort's seat limit.
app.put("/apply/:id", requireAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const { status, scholarshipPercent, reviewNote, cohortId } = req.body;

    if (status !== undefined && !APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}`,
      });
    }

    if (scholarshipPercent !== undefined) {
      const pct = Number(scholarshipPercent);
      if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
        return res
          .status(400)
          .json({ message: "Scholarship must be between 0 and 100 percent" });
      }
      application.scholarshipPercent = pct;
    }

    if (reviewNote !== undefined) {
      application.reviewNote = String(reviewNote).slice(0, 1000);
    }

    if (cohortId !== undefined) {
      if (!cohortId) {
        application.cohort = undefined;
        application.cohortName = "";
      } else {
        const cohort = mongoose.isValidObjectId(cohortId)
          ? await Cohort.findById(cohortId)
          : null;
        if (!cohort) {
          return res.status(400).json({ message: "Cohort not found" });
        }
        application.cohort = cohort._id;
        application.cohortName = cohort.name;
      }
    }

    // Seat limit: only approved applicants take a seat
    const nextStatus = status !== undefined ? status : application.status;
    if (nextStatus === "Approved" && application.cohort) {
      const cohort = await Cohort.findById(application.cohort);
      if (cohort) {
        const taken = await Application.countDocuments({
          cohort: cohort._id,
          status: "Approved",
          _id: { $ne: application._id },
        });
        if (taken >= cohort.seats) {
          return res.status(409).json({
            message: `${cohort.name} is full (${cohort.seats} seats). Waitlist this applicant or add seats to the cohort.`,
          });
        }
      }
    }

    if (status !== undefined) application.status = status;
    application.reviewedAt = new Date();

    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Delete application (admin only)
app.delete("/apply/:id", requireAdmin, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);

    res.json({
      message: "Application deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================
// SERVER
// ======================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
