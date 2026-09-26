import express from "express";
import multer from "multer";
import path from "path";
import CareerApplication from "../models/CareerApplication.js";

const router = express.Router();

// ----------------- MULTER CONFIG -----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ----------------- GET ALL CAREER APPLICATIONS -----------------
router.get("/careers", async (req, res) => {
  try {
    const careers = await CareerApplication.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- SUBMIT NEW CAREER APPLICATION -----------------
router.post("/careers", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const { name, email, phone, position, message } = req.body;

    const newApplication = new CareerApplication({
      name,
      email,
      phone,
      position,
      message,
      resume: req.file.path,
    });

    await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (err) {
    console.error("Career submission error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ----------------- UPDATE CAREER APPLICATION STATUS -----------------
router.put("/careers/:id", async (req, res) => {
  try {
    const career = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(career);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- DELETE CAREER APPLICATION -----------------
router.delete("/careers/:id", async (req, res) => {
  try {
    await CareerApplication.findByIdAndDelete(req.params.id);
    res.json({ message: "Career application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
