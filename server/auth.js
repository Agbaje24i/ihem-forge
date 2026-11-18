import jwt from "jsonwebtoken";

// Secrets and the admin login can now be set with environment variables
// (put them in server/.env, which must NOT be committed). The fallbacks are the
// old hard-coded values so existing logins keep working until you set your own.
// IMPORTANT: change all four before going live - the fallbacks are public.
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
export const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "IHEM_SECRET_KEY";
export const STUDENT_JWT_SECRET =
  process.env.STUDENT_JWT_SECRET || "IHEM_STUDENT_SECRET_KEY";

const readToken = (req) => {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
};

const guard = (secret, key) => (req, res, next) => {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: "Please log in first" });

  try {
    req[key] = jwt.verify(token, secret);
    next();
  } catch (err) {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
};

export const requireAdmin = guard(ADMIN_JWT_SECRET, "admin");
export const requireStudent = guard(STUDENT_JWT_SECRET, "student");

// Safe to drop into a RegExp (used for case-insensitive exact email matching)
export const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const emailMatcher = (email) => new RegExp(`^${escapeRegExp(email)}$`, "i");
