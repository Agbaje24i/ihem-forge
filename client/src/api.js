// Shared helpers for talking to the backend.
// Where the backend lives. Order of choice:
// 1. REACT_APP_API_URL from client/.env, if set
// 2. In GitHub Codespaces: "" (same address as the site). The dev server
//    forwards API calls to the backend on port 5000 (see "proxy" in
//    client/package.json), so port visibility and CORS do not matter.
// 3. http://localhost:5000
const guessApiUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  try {
    if (window.location.hostname.endsWith(".app.github.dev")) return "";
  } catch {}
  return "http://localhost:5000";
};

export const API = guessApiUrl();

const read = (key) => {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
};

// Sends a request with the logged-in person's token and returns
// { ok, status, data }. It never throws on HTTP errors, only returns them.
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: { message: "Cannot reach the server. Is the backend running?" },
    };
  }
}

// Admin requests. If the session has expired, send the admin back to log in.
export async function adminRequest(path, options = {}) {
  const result = await request(path, { ...options, token: read("adminToken") });

  if (result.status === 401) {
    try {
      localStorage.removeItem("adminToken");
    } catch {}
    window.location.assign("/admin-login");
  }
  return result;
}

// Student requests. If the session has expired, send the student to log in.
export async function studentRequest(path, options = {}) {
  const result = await request(path, { ...options, token: read("studentToken") });

  if (result.status === 401) {
    try {
      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentInfo");
    } catch {}
    const back = encodeURIComponent(window.location.pathname);
    window.location.assign(`/student-login?redirect=${back}`);
  }
  return result;
}

// Public requests (no login needed).
export const publicRequest = (path, options = {}) => request(path, options);

// Formatting helpers used on several pages
export const naira = (n) =>
  `₦${(Number(n) || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "TBA";

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "TBA";

// Value for an <input type="date"> / datetime-local from an ISO string
export const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");
export const toDateTimeInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};
