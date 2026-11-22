import express from "express";
import mongoose from "mongoose";

import Application from "../models/Application.js";
import Cohort from "../models/Cohort.js";
import Lesson from "../models/Lesson.js";
import LessonProgress from "../models/LessonProgress.js";
import Payment from "../models/Payment.js";
import { requireAdmin, requireStudent, emailMatcher } from "../auth.js";
import { computeFinance, computeProgress, seatsLeft } from "../lib/finance.js";

const router = express.Router();

const isId = (id) => mongoose.isValidObjectId(id);
const fail = (res, status, message) => res.status(status).json({ message });
const serverError = (res, err) => res.status(500).json({ message: err.message });

// How many approved students each cohort has, as a { cohortId: count } map
async function approvedCounts(cohortIds) {
  const rows = await Application.aggregate([
    { $match: { cohort: { $in: cohortIds }, status: "Approved" } },
    { $group: { _id: "$cohort", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(rows.map((r) => [String(r._id), r.count]));
}

// Validates the fields of a cohort. Returns { error } or { data }.
function readCohort(body) {
  const track = String(body.track || "").trim();
  const name = String(body.name || "").trim();
  const startDate = new Date(body.startDate);
  const endDate = body.endDate ? new Date(body.endDate) : undefined;
  const seats = Number(body.seats);
  const tuition = body.tuition === "" || body.tuition == null ? 0 : Number(body.tuition);
  const mode = body.mode || "any";
  const status = body.status || "Open";
  const communityLink = String(body.communityLink || "").trim();

  if (communityLink && !/^https?:\/\//i.test(communityLink)) {
    return { error: "Community link must start with http:// or https://" };
  }
  if (!track) return { error: "Track is required" };
  if (!name) return { error: "Cohort name is required" };
  if (Number.isNaN(startDate.getTime())) return { error: "A valid start date is required" };
  if (endDate && (Number.isNaN(endDate.getTime()) || endDate < startDate)) {
    return { error: "End date must be on or after the start date" };
  }
  if (!Number.isInteger(seats) || seats < 1) return { error: "Seats must be a whole number of 1 or more" };
  if (!Number.isFinite(tuition) || tuition < 0) return { error: "Tuition cannot be negative" };
  if (!["online", "in-person", "hybrid", "any"].includes(mode)) return { error: "Invalid learning mode" };
  if (!["Open", "Closed"].includes(status)) return { error: "Invalid status" };

  return { data: { track, name, startDate, endDate, seats, tuition, mode, status, communityLink } };
}

// ======================
// PUBLIC: UPCOMING OPEN COHORTS
// ======================
router.get("/cohorts", async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const filter = { status: "Open", startDate: { $gte: startOfToday } };
    if (req.query.track) filter.track = String(req.query.track);

    const cohorts = await Cohort.find(filter).sort({ startDate: 1 }).lean();
    const counts = await approvedCounts(cohorts.map((c) => c._id));

    res.json(
      cohorts.map((c) => ({
        _id: c._id,
        track: c.track,
        name: c.name,
        startDate: c.startDate,
        endDate: c.endDate,
        mode: c.mode,
        tuition: c.tuition,
        seats: c.seats,
        seatsLeft: seatsLeft(c.seats, counts[String(c._id)]),
      }))
    );
  } catch (err) {
    serverError(res, err);
  }
});

// ======================
// ADMIN: COHORTS
// ======================
router.get("/admin/cohorts", requireAdmin, async (req, res) => {
  try {
    const cohorts = await Cohort.find().sort({ startDate: -1 }).lean();
    const ids = cohorts.map((c) => c._id);
    const approved = await approvedCounts(ids);

    const totals = await Application.aggregate([
      { $match: { cohort: { $in: ids } } },
      { $group: { _id: "$cohort", count: { $sum: 1 } } },
    ]);
    const totalMap = Object.fromEntries(totals.map((r) => [String(r._id), r.count]));

    res.json(
      cohorts.map((c) => ({
        ...c,
        approved: approved[String(c._id)] || 0,
        applications: totalMap[String(c._id)] || 0,
        seatsLeft: seatsLeft(c.seats, approved[String(c._id)]),
      }))
    );
  } catch (err) {
    serverError(res, err);
  }
});

router.post("/cohorts", requireAdmin, async (req, res) => {
  try {
    const { error, data } = readCohort(req.body);
    if (error) return fail(res, 400, error);

    const cohort = await Cohort.create(data);
    res.status(201).json(cohort);
  } catch (err) {
    serverError(res, err);
  }
});

router.put("/cohorts/:id", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid cohort id");

    const { error, data } = readCohort(req.body);
    if (error) return fail(res, 400, error);

    // Cannot shrink below the number of students already approved
    const approved = await Application.countDocuments({
      cohort: req.params.id,
      status: "Approved",
    });
    if (data.seats < approved) {
      return fail(res, 400, `${approved} students are already approved, so seats cannot go below ${approved}`);
    }

    const cohort = await Cohort.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!cohort) return fail(res, 404, "Cohort not found");

    // Keep the cohort name stored on applications in step
    await Application.updateMany({ cohort: cohort._id }, { cohortName: cohort.name });

    res.json(cohort);
  } catch (err) {
    serverError(res, err);
  }
});

router.delete("/cohorts/:id", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid cohort id");

    const used = await Application.countDocuments({ cohort: req.params.id });
    if (used > 0) {
      return fail(res, 409, `${used} application(s) use this cohort. Close it instead of deleting it.`);
    }

    await Lesson.deleteMany({ cohort: req.params.id });
    await Cohort.findByIdAndDelete(req.params.id);
    res.json({ message: "Cohort deleted" });
  } catch (err) {
    serverError(res, err);
  }
});

// ======================
// ADMIN: LESSONS (classes, assignments, resources)
// ======================
function readLesson(body) {
  const title = String(body.title || "").trim();
  const kind = body.kind || "class";
  const date = body.date ? new Date(body.date) : undefined;
  const link = String(body.link || "").trim();
  const videoUrl = String(body.videoUrl || "").trim();

  if (!title) return { error: "Title is required" };
  if (videoUrl && !/^https?:\/\//i.test(videoUrl)) return { error: "Video link must start with http:// or https://" };
  if (!["class", "assignment", "resource"].includes(kind)) return { error: "Invalid lesson type" };
  if (date && Number.isNaN(date.getTime())) return { error: "Invalid date" };
  // Only web links, so a lesson link can never run script in a student's browser
  if (link && !/^https?:\/\//i.test(link)) return { error: "Link must start with http:// or https://" };

  return {
    data: {
      title,
      kind,
      date,
      link,
      videoUrl,
      module: String(body.module || "").trim(),
      content: String(body.content || ""),
      description: String(body.description || "").trim(),
      order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
    },
  };
}

router.get("/admin/cohorts/:id/lessons", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid cohort id");
    const lessons = await Lesson.find({ cohort: req.params.id }).sort({ order: 1, date: 1, createdAt: 1 });
    res.json(lessons);
  } catch (err) {
    serverError(res, err);
  }
});

router.post("/admin/cohorts/:id/lessons", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid cohort id");
    if (!(await Cohort.exists({ _id: req.params.id }))) return fail(res, 404, "Cohort not found");

    const { error, data } = readLesson(req.body);
    if (error) return fail(res, 400, error);

    const lesson = await Lesson.create({ ...data, cohort: req.params.id });
    res.status(201).json(lesson);
  } catch (err) {
    serverError(res, err);
  }
});

// Course content that every cohort of a track sees
router.get("/admin/track-lessons", requireAdmin, async (req, res) => {
  try {
    const track = String(req.query.track || "").trim();
    if (!track) return fail(res, 400, "Track is required");
    const lessons = await Lesson.find({ track }).sort({ order: 1, createdAt: 1 });
    res.json(lessons);
  } catch (err) {
    serverError(res, err);
  }
});

router.post("/admin/track-lessons", requireAdmin, async (req, res) => {
  try {
    const track = String(req.body.track || "").trim();
    if (!track) return fail(res, 400, "Track is required");

    const { error, data } = readLesson(req.body);
    if (error) return fail(res, 400, error);

    const lesson = await Lesson.create({ ...data, track });
    res.status(201).json(lesson);
  } catch (err) {
    serverError(res, err);
  }
});

router.put("/admin/lessons/:id", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid lesson id");

    const { error, data } = readLesson(req.body);
    if (error) return fail(res, 400, error);

    const lesson = await Lesson.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!lesson) return fail(res, 404, "Lesson not found");
    res.json(lesson);
  } catch (err) {
    serverError(res, err);
  }
});

router.delete("/admin/lessons/:id", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid lesson id");
    await LessonProgress.deleteMany({ lesson: req.params.id });
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    serverError(res, err);
  }
});

// ======================
// ADMIN: PAYMENTS (recorded by hand - there is no online payment gateway yet)
// ======================
async function financeFor(application) {
  const cohort = application.cohort ? await Cohort.findById(application.cohort).lean() : null;
  const payments = await Payment.find({ application: application._id }).sort({ paidAt: -1 }).lean();
  return {
    payments,
    finance: computeFinance({
      tuition: cohort ? cohort.tuition : 0,
      scholarshipPercent: application.scholarshipPercent,
      payments,
    }),
    hasCohort: Boolean(cohort),
  };
}

router.get("/admin/applications/:id/finance", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid application id");
    const application = await Application.findById(req.params.id);
    if (!application) return fail(res, 404, "Application not found");
    res.json(await financeFor(application));
  } catch (err) {
    serverError(res, err);
  }
});

router.post("/admin/applications/:id/payments", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid application id");
    const application = await Application.findById(req.params.id);
    if (!application) return fail(res, 404, "Application not found");

    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return fail(res, 400, "Enter an amount greater than zero");

    const method = req.body.method || "Bank transfer";
    if (!["Bank transfer", "Cash", "Card / online", "Other"].includes(method)) {
      return fail(res, 400, "Invalid payment method");
    }

    const paidAt = req.body.paidAt ? new Date(req.body.paidAt) : new Date();
    if (Number.isNaN(paidAt.getTime())) return fail(res, 400, "Invalid payment date");

    await Payment.create({
      application: application._id,
      amount,
      method,
      reference: String(req.body.reference || "").trim(),
      note: String(req.body.note || "").trim(),
      paidAt,
    });

    res.status(201).json(await financeFor(application));
  } catch (err) {
    serverError(res, err);
  }
});

router.delete("/admin/payments/:id", requireAdmin, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid payment id");

    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return fail(res, 404, "Payment not found");

    const application = await Application.findById(payment.application);
    res.json(application ? await financeFor(application) : { payments: [] });
  } catch (err) {
    serverError(res, err);
  }
});

// ======================
// STUDENT PORTAL
// ======================

// Everything the logged-in student needs: their applications, status, cohort,
// fees and balance, and (once approved) their lessons and progress.
router.get("/student/portal", requireStudent, async (req, res) => {
  try {
    const email = String(req.student.email || "").toLowerCase();

    const applications = await Application.find({ email: emailMatcher(req.student.email) })
      .sort({ createdAt: -1 })
      .populate("cohort")
      .lean();

    const result = [];

    for (const app of applications) {
      const cohort = app.cohort || null;
      const payments = await Payment.find({ application: app._id }).sort({ paidAt: -1 }).lean();
      const finance = computeFinance({
        tuition: cohort ? cohort.tuition : 0,
        scholarshipPercent: app.scholarshipPercent,
        payments,
      });

      let lessons = [];
      let progress = { total: 0, completed: 0, percent: 0 };

      // Lessons are only shown to approved students
      if (app.status === "Approved") {
        const sources = [{ track: app.course }];
        if (cohort) sources.push({ cohort: cohort._id });
        const found = await Lesson.find({ $or: sources })
          .sort({ order: 1, date: 1, createdAt: 1 })
          .lean();
        const done = await LessonProgress.find({
          email,
          lesson: { $in: found.map((l) => l._id) },
        }).lean();
        const doneIds = done.map((d) => String(d.lesson));

        lessons = found.map((l) => ({
          _id: l._id,
          title: l.title,
          description: l.description,
          kind: l.kind,
          date: l.date,
          link: l.link,
          videoUrl: l.videoUrl,
          module: l.module,
          content: l.content,
          completed: doneIds.includes(String(l._id)),
        }));
        progress = computeProgress(found.map((l) => l._id), doneIds);
      }

      result.push({
        _id: app._id,
        applicationId: app.applicationId,
        course: app.course,
        status: app.status,
        learningMode: app.learningMode,
        appliedAt: app.createdAt,
        reviewNote: app.reviewNote,
        cohort: cohort
          ? {
              _id: cohort._id,
              name: cohort.name,
              startDate: cohort.startDate,
              endDate: cohort.endDate,
              mode: cohort.mode,
              communityLink: cohort.communityLink,
            }
          : null,
        finance,
        payments: payments.map((p) => ({
          _id: p._id,
          amount: p.amount,
          method: p.method,
          reference: p.reference,
          paidAt: p.paidAt,
        })),
        lessons,
        progress,
      });
    }

    res.json({
      student: { fullName: req.student.fullName, email: req.student.email },
      applications: result,
    });
  } catch (err) {
    serverError(res, err);
  }
});

// Mark a lesson done (or not done). Only approved students of that cohort can.
router.post("/student/lessons/:id/complete", requireStudent, async (req, res) => {
  try {
    if (!isId(req.params.id)) return fail(res, 400, "Invalid lesson id");

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return fail(res, 404, "Lesson not found");

    const enrolled = await Application.exists({
      email: emailMatcher(req.student.email),
      status: "Approved",
      ...(lesson.cohort ? { cohort: lesson.cohort } : { course: lesson.track }),
    });
    if (!enrolled) return fail(res, 403, "You are not enrolled in this course");

    const email = String(req.student.email).toLowerCase();
    const completed = req.body.completed !== false;

    if (completed) {
      await LessonProgress.updateOne(
        { email, lesson: lesson._id },
        { $setOnInsert: { email, lesson: lesson._id, completedAt: new Date() } },
        { upsert: true }
      );
    } else {
      await LessonProgress.deleteOne({ email, lesson: lesson._id });
    }

    res.json({ lessonId: lesson._id, completed });
  } catch (err) {
    serverError(res, err);
  }
});

export default router;
