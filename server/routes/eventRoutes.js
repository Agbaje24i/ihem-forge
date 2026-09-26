import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// ----------------- GET ALL EVENT REGISTRATIONS -----------------
router.get("/register-event", async (req, res) => {
  try {
    const registrations = await Event.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- SUBMIT NEW EVENT REGISTRATION -----------------
router.post("/register-event", async (req, res) => {
  try {
    const { eventTitle, name, email, message } = req.body;

    if (!eventTitle || !name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const registration = new Event({ eventTitle, name, email, message });
    await registration.save();

    console.log("Event registration saved:", registration._id);

    res.status(201).json({
      message: "Successfully registered for the event",
      registration,
    });
  } catch (error) {
    console.error("Event registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ----------------- DELETE EVENT REGISTRATION -----------------
router.delete("/register-event/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Registration deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
