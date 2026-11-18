import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import StudentAccount from "../models/StudentAccount.js";
import { STUDENT_JWT_SECRET } from "../auth.js";

const router = express.Router();

const JWT_SECRET = STUDENT_JWT_SECRET;

router.post("/student-register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await StudentAccount.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await StudentAccount.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: student._id, email: student.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      token,
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
      },
      message: "Registration successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/student-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await StudentAccount.findOne({ email });

    if (!student) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: student._id, email: student.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
      },
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
