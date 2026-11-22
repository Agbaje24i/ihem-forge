import React, { useCallback, useEffect, useState } from "react";
import { adminRequest, formatDateTime, toDateTimeInput } from "../../api";

const inputClass = "w-full border rounded-lg p-2.5";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

const emptyLesson = {
  title: "",
  kind: "class",
  module: "",
  date: "",
  link: "",
  videoUrl: "",
  description: "",
  content: "",
  order: 0,
};

const Field = ({ label, children }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

/**
 * Lists and edits lessons.
 *  - listUrl:   GET endpoint that returns the lessons
 *  - createUrl: POST endpoint that creates one
 *  - extraBody: fields added to every create (for example { track })
 */
const LessonEditor = ({ listUrl, createUrl, extraBody = {} }) => {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(emptyLesson);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { ok, data } = await adminRequest(listUrl);
    setLessons(ok && Array.isArray(data) ? data : []);
  }, [listUrl]);

  useEffect(() => {
    setEditingId(null);
    setForm(emptyLesson);
    load();
  }, [load]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (l) => {
    setEditingId(l._id);
    setForm({
      title: l.title,
      kind: l.kind,
      module: l.module || "",
      date: toDateTimeInput(l.date),
      link: l.link || "",
      videoUrl: l.videoUrl || "",
      description: l.description || "",
      content: l.content || "",
      order: l.order || 0,
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

    const body = { ...form, order: Number(form.order) || 0, date: form.date ? new Date(form.date).toISOString() : "" };
    const { ok, data } = editingId
      ? await adminRequest(`/admin/lessons/${editingId}`, { method: "PUT", body })
      : await adminRequest(createUrl, { method: "POST", body: { ...body, ...extraBody } });

    setSaving(false);
    if (!ok) {
      setError(data?.message || "Could not save the lesson");
      return;
    }
    reset();
    load();
  };

  const remove = async (l) => {
    if (!window.confirm(`Delete "${l.title}"? Students' progress on it is removed too.`)) return;
    await adminRequest(`/admin/lessons/${l._id}`, { method: "DELETE" });
    if (editingId === l._id) reset();
    load();
  };

  return (
    <div>
      <div className="space-y-2">
        {lessons.length === 0 ? (
          <p className="text-gray-500">Nothing here yet. Add the first lesson below.</p>
        ) : (
          lessons.map((l, i) => (
            <div key={l._id} className="flex items-start justify-between gap-3 border rounded-lg p-3">
              <div>
                <p className="font-semibold">
                  {i + 1}. {l.title}
                  <span className="ml-2 text-xs uppercase tracking-wide bg-gray-100 rounded px-2 py-0.5">{l.kind}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {l.module ? `${l.module} · ` : ""}
                  {l.date ? formatDateTime(l.date) : "No date"}
                  {l.videoUrl ? " · video" : ""}
                  {l.content ? " · text" : ""}
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
              <option value="class">Class / lesson</option>
              <option value="assignment">Assignment</option>
              <option value="resource">Resource</option>
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Module (section heading)">
            <input name="module" value={form.module} onChange={change} placeholder="Week 1: Basics" className={inputClass} />
          </Field>
          <Field label="Order (1, 2, 3...)">
            <input type="number" name="order" value={form.order} onChange={change} className={inputClass} />
          </Field>
          <Field label="Date and time (optional)">
            <input type="datetime-local" name="date" value={form.date} onChange={change} className={inputClass} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Video link (YouTube, Vimeo, recording)">
            <input name="videoUrl" value={form.videoUrl} onChange={change} placeholder="https://..." className={inputClass} />
          </Field>
          <Field label="Other link (meeting, slides, file)">
            <input name="link" value={form.link} onChange={change} placeholder="https://..." className={inputClass} />
          </Field>
        </div>

        <Field label="Short description">
          <input name="description" value={form.description} onChange={change} className={inputClass} />
        </Field>

        <Field label="Lesson notes (shown in the course player)">
          <textarea name="content" value={form.content} onChange={change} rows="6" className={inputClass} />
        </Field>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-60">
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
  );
};

export default LessonEditor;
