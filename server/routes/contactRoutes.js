import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// ----------------- GET ALL MESSAGES (admin Messages page) -----------------
router.get("/contact", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- SUBMIT CONTACT FORM -----------------
router.post("/contact", async (req, res) => {
  try {
    const { name, fullName, email, phone, subject, message } = req.body;

    if (!(name || fullName) || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email and message are required" });
    }

    await Message.create({
      name: name || fullName,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({ message: "Thank you! Your message has been sent." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- DELETE A MESSAGE -----------------
router.delete("/contact/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
