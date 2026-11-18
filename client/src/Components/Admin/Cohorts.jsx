import React, { useCallback, useEffect, useState } from "react";
import { adminRequest, formatDate, formatDateTime, naira, toDateInput, toDateTimeInput } from "../../api";
import { categories, tracks } from "../../data/tracks";

const inputClass = "w-full border rounded-lg p-2.5";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

const emptyCohort = {
  track: "",
  name: "",
  startDate: "",
  endDate: "",
  mode: "any",
  seats: 30,
  tuition: 0,
  status: "Open",
};

const emptyLesson = { title: "", kind: "class", date: "", link: "", description: "", order: 0 };

const Field = ({ label, children }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

// ----------------------------------------------------------------
// Lessons manager for one cohort (classes, assignments, resources)
// ----------------------------------------------------------------
const LessonsManager = ({ cohort, onClose }) => {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(emptyLesson);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { ok, data } = await adminRequest(`/admin/cohorts/${cohort._id}/lessons`);
    setLessons(ok && Array.isArray(data) ? data : []);
  }, [cohort._id]);

  useEffect(() => {
    load();
  }, [load]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (lesson) => {
    setEditingId(lesson._id);
    setForm({
      title: lesson.title,
      kind: lesson.kind,
      date: toDateTimeInput(lesson.date),
      link: lesson.link || "",
      description: lesson.description || "",
      order: lesson.order || 0,
    });
    setError("");
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyLesson);
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = { ...form, date: form.date ? new Date(form.date).toISOString() : "" };
    const { ok, data } = editingId
      ? await adminRequest(`/admin/lessons/${editingId}`, { method: "PUT", body })
      : await adminRequest(`/admin/cohorts/${cohort._id}/lessons`, { method: "POST", body });

    setSaving(false);
    if (!ok) {
      setError(data?.message || "Could not save the lesson");
      return;
    }
    reset();
    load();
  };

  const remove = async (lesson) => {
    if (!window.confirm(`Delete "${lesson.title}"? Students' progress on it is removed too.`)) return;
    await adminRequest(`/admin/lessons/${lesson._id}`, { method: "DELETE" });
    if (editingId === lesson._id) reset();
    load();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-8 my-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Classes &amp; assignments</h2>
            <p className="text-gray-600">
              {cohort.name} · {cohort.track}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">
            ×
          </button>
        </div>

        {/* List */}
        <div className="mt-6 space-y-2">
          {lessons.length === 0 ? (
            <p className="text-gray-500">No lessons yet. Add the first one below.</p>
          ) : (
            lessons.map((l, i) => (
              <div key={l._id} className="flex items-start justify-between gap-3 border rounded-lg p-3">
                <div>
                  <p className="font-semibold">
                    {i + 1}. {l.title}{" "}
                    <span className="ml-2 text-xs uppercase tracking-wide bg-gray-100 rounded px-2 py-0.5">
                      {l.kind}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {l.date ? formatDateTime(l.date) : "No date set"}
                    {l.link ? " · has link" : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(l)} className="bg-blue-600 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => remove(l)} className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <form onSubmit={save} className="mt-8 border-t pt-6 space-y-4">
          <h3 className="text-lg font-bold">{editingId ? "Edit lesson" : "Add a lesson"}</h3>

          {error && <p className="bg-red-50 text-red-700 rounded p-3 text-sm">{error}</p>}

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Field label="Title">
                <input name="title" value={form.title} onChange={change} required className={inputClass} />
              </Field>
            </div>
            <Field label="Type">
              <select name="kind" value={form.kind} onChange={change} className={inputClass}>
                <option value="class">Class</option>
                <option value="assignment">Assignment</option>
                <option value="resource">Resource</option>
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Date and time (or due date)">
              <input type="datetime-local" name="date" value={form.date} onChange={change} className={inputClass} />
            </Field>
            <Field label="Order">
              <input type="number" name="order" value={form.order} onChange={change} className={inputClass} />
            </Field>
            <Field label="Link (meeting, recording, file)">
              <input name="link" value={form.link} onChange={change} placeholder="https://..." className={inputClass} />
            </Field>
          </div>

          <Field label="Description">
            <textarea name="description" value={form.description} onChange={change} rows="3" className={inputClass} />
          </Field>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Save changes" : "Add lesson"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="bg-gray-500 text-white px-5 py-2 rounded-lg">
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// Cohorts page
// ----------------------------------------------------------------
const Cohorts = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyCohort);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [lessonsFor, setLessonsFor] = useState(null);

  const load = useCallback(async () => {
    const { ok, data } = await adminRequest("/admin/cohorts");
    if (ok && Array.isArray(data)) {
      setCohorts(data);
      setPageError("");
    } else {
      setPageError(data?.message || "Could not load cohorts");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyCohort);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({
      track: c.track,
      name: c.name,
      startDate: toDateInput(c.startDate),
      endDate: toDateInput(c.endDate),
      mode: c.mode,
      seats: c.seats,
      tuition: c.tuition,
      status: c.status,
    });
    setFormError("");
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const body = { ...form, seats: Number(form.seats), tuition: Number(form.tuition) };
    const { ok, data } = editingId
      ? await adminRequest(`/cohorts/${editingId}`, { method: "PUT", body })
      : await adminRequest("/cohorts", { method: "POST", body });

    setSaving(false);
    if (!ok) {
      setFormError(data?.message || "Could not save the cohort");
      return;
    }
    setShowForm(false);
    load();
  };

  const toggleStatus = async (c) => {
    const next = c.status === "Open" ? "Closed" : "Open";
    const { ok, data } = await adminRequest(`/cohorts/${c._id}`, {
      method: "PUT",
      body: {
        track: c.track,
        name: c.name,
        startDate: c.startDate,
        endDate: c.endDate || "",
        mode: c.mode,
        seats: c.seats,
        tuition: c.tuition,
        status: next,
      },
    });
    if (!ok) window.alert(data?.message || "Could not update the cohort");
    load();
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete ${c.name}? This also deletes its lessons.`)) return;
    const { ok, data } = await adminRequest(`/cohorts/${c._id}`, { method: "DELETE" });
    if (!ok) window.alert(data?.message || "Could not delete the cohort");
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Cohorts &amp; Classes</h1>
          <p className="text-gray-600 mt-1">
            Set intake dates, seat limits and fees. Students choose a cohort when they apply, and approved
            students see the cohort&apos;s classes in their portal.
          </p>
        </div>
        <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg">
          + New cohort
        </button>
      </div>

      {pageError && <p className="bg-red-50 text-red-700 rounded p-3 mb-6">{pageError}</p>}

      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        {loading ? (
          <p>Loading cohorts...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Cohort</th>
                <th className="p-3 text-left">Track</th>
                <th className="p-3 text-left">Starts</th>
                <th className="p-3 text-left">Mode</th>
                <th className="p-3 text-left">Seats</th>
                <th className="p-3 text-left">Fee</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-gray-500">
                    No cohorts yet. Create your first intake.
                  </td>
                </tr>
              ) : (
                cohorts.map((c) => (
                  <tr key={c._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{c.name}</td>
                    <td className="p-3">{c.track}</td>
                    <td className="p-3">{formatDate(c.startDate)}</td>
                    <td className="p-3 capitalize">{c.mode}</td>
                    <td className="p-3">
                      {c.approved}/{c.seats} filled
                      <span className="block text-xs text-gray-500">
                        {c.seatsLeft} left · {c.applications} applied
                      </span>
                    </td>
                    <td className="p-3">{naira(c.tuition)}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          c.status === "Open" ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2 whitespace-nowrap">
                      <button onClick={() => setLessonsFor(c)} className="bg-purple-600 text-white px-3 py-1 rounded">
                        Classes
                      </button>
                      <button onClick={() => openEdit(c)} className="bg-blue-600 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={() => toggleStatus(c)} className="bg-yellow-600 text-white px-3 py-1 rounded">
                        {c.status === "Open" ? "Close" : "Reopen"}
                      </button>
                      <button onClick={() => remove(c)} className="bg-red-600 text-white px-3 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / edit cohort */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto z-50 p-4">
          <form onSubmit={save} className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-8 my-8 space-y-4">
            <h2 className="text-2xl font-bold">{editingId ? "Edit cohort" : "New cohort"}</h2>

            {formError && <p className="bg-red-50 text-red-700 rounded p-3 text-sm">{formError}</p>}

            <Field label="Track">
              <select name="track" value={form.track} onChange={change} required className={inputClass}>
                <option value="">Select a track</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.label}>
                    {tracks
                      .filter((t) => t.category === cat.id)
                      .map((t) => (
                        <option key={t.slug} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </Field>

            <Field label="Cohort name (for example: March 2027 Intake)">
              <input name="name" value={form.name} onChange={change} required className={inputClass} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Start date">
                <input type="date" name="startDate" value={form.startDate} onChange={change} required className={inputClass} />
              </Field>
              <Field label="End date (optional)">
                <input type="date" name="endDate" value={form.endDate} onChange={change} className={inputClass} />
              </Field>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Learning mode">
                <select name="mode" value={form.mode} onChange={change} className={inputClass}>
                  <option value="any">Any (student chooses)</option>
                  <option value="online">Online</option>
                  <option value="in-person">In-person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </Field>
              <Field label="Seats">
                <input type="number" min="1" name="seats" value={form.seats} onChange={change} required className={inputClass} />
              </Field>
              <Field label="Full fee (₦)">
                <input type="number" min="0" name="tuition" value={form.tuition} onChange={change} className={inputClass} />
              </Field>
            </div>

            <Field label="Status">
              <select name="status" value={form.status} onChange={change} className={inputClass}>
                <option value="Open">Open for applications</option>
                <option value="Closed">Closed</option>
              </select>
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-5 py-2 rounded-lg">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save cohort"}
              </button>
            </div>
          </form>
        </div>
      )}

      {lessonsFor && <LessonsManager cohort={lessonsFor} onClose={() => setLessonsFor(null)} />}
    </div>
  );
};

export default Cohorts;
