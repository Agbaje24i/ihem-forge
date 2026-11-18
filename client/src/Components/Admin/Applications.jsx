import React, { useCallback, useEffect, useMemo, useState } from "react";
import { adminRequest, formatDate, formatDateTime, naira, toDateInput } from "../../api";

const STATUSES = ["Pending", "Approved", "Waitlisted", "Rejected"];

const statusColor = {
  Pending: "bg-yellow-500",
  Approved: "bg-green-600",
  Waitlisted: "bg-blue-500",
  Rejected: "bg-red-600",
};

const wantsScholarship = (a) => /scholar/i.test(a.supportNeeded || "");

const inputClass = "w-full border rounded-lg p-2.5";

const Row = ({ label, children }) => (
  <p>
    <strong>{label}:</strong> {children || "-"}
  </p>
);

// ----------------------------------------------------------------
// Review modal: details, decision, scholarship, cohort, payments
// ----------------------------------------------------------------
const ReviewModal = ({ application, cohorts, onClose, onChanged }) => {
  const [status, setStatus] = useState(application.status || "Pending");
  const [scholarship, setScholarship] = useState(application.scholarshipPercent || 0);
  const [note, setNote] = useState(application.reviewNote || "");
  const [cohortId, setCohortId] = useState(application.cohort || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fin, setFin] = useState(null);
  const [pay, setPay] = useState({ amount: "", method: "Bank transfer", reference: "", paidAt: toDateInput(new Date()) });
  const [payError, setPayError] = useState("");

  const trackCohorts = cohorts.filter((c) => c.track === application.course);

  const loadFinance = useCallback(async () => {
    const { ok, data } = await adminRequest(`/admin/applications/${application._id}/finance`);
    if (ok) setFin(data);
  }, [application._id]);

  useEffect(() => {
    loadFinance();
  }, [loadFinance]);

  const save = async (nextStatus) => {
    setSaving(true);
    setError("");
    setSaved(false);

    const body = {
      status: nextStatus,
      scholarshipPercent: Number(scholarship) || 0,
      reviewNote: note,
    };
    if (cohortId) body.cohortId = cohortId;

    const { ok, data } = await adminRequest(`/apply/${application._id}`, { method: "PUT", body });
    setSaving(false);

    if (!ok) {
      setError(data?.message || "Could not save");
      return;
    }
    setStatus(nextStatus);
    setSaved(true);
    onChanged();
    loadFinance();
  };

  const addPayment = async (e) => {
    e.preventDefault();
    setPayError("");
    const { ok, data } = await adminRequest(`/admin/applications/${application._id}/payments`, {
      method: "POST",
      body: { ...pay, amount: Number(pay.amount) },
    });
    if (!ok) {
      setPayError(data?.message || "Could not record the payment");
      return;
    }
    setFin(data);
    setPay({ ...pay, amount: "", reference: "" });
  };

  const removePayment = async (id) => {
    if (!window.confirm("Delete this payment record?")) return;
    const { ok, data } = await adminRequest(`/admin/payments/${id}`, { method: "DELETE" });
    if (ok) setFin(data);
  };

  const f = fin?.finance;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-8 my-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">{application.fullName}</h2>
            <p className="text-gray-600">{application.applicationId}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Details */}
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mt-6">
          <Row label="Email">{application.email}</Row>
          <Row label="Phone">{application.phone}</Row>
          <Row label="Gender">{application.gender}</Row>
          <Row label="Qualification">{application.qualification}</Row>
          <Row label="Track">{application.course}</Row>
          <Row label="Learning mode">{application.learningMode}</Row>
          <Row label="Experience level">{application.experienceLevel}</Row>
          <Row label="Cohort requested">{application.cohortName}</Row>
          <Row label="Applied">{formatDateTime(application.createdAt)}</Row>
          <Row label="Current status">{application.status}</Row>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-4 space-y-2">
          <Row label="Scholarship / support request">{application.supportNeeded}</Row>
          <Row label="Message">{application.message}</Row>
        </div>

        {/* Decision */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-bold mb-4">Decision</h3>

          {error && <p className="bg-red-50 text-red-700 rounded p-3 text-sm mb-4">{error}</p>}
          {saved && <p className="bg-green-50 text-green-700 rounded p-3 text-sm mb-4">Saved.</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Cohort</label>
              <select value={cohortId} onChange={(e) => setCohortId(e.target.value)} className={inputClass}>
                <option value="">No cohort assigned</option>
                {trackCohorts.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} · {formatDate(c.startDate)} · {c.seatsLeft} seats left
                  </option>
                ))}
              </select>
              {trackCohorts.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">No cohorts exist for this track yet. Create one under Cohorts &amp; Classes.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Scholarship awarded (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={scholarship}
                onChange={(e) => setScholarship(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">Internal note</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows="2" className={inputClass} />
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button disabled={saving} onClick={() => save("Approved")} className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-60">
              Approve
            </button>
            <button disabled={saving} onClick={() => save("Waitlisted")} className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-60">
              Waitlist
            </button>
            <button disabled={saving} onClick={() => save("Rejected")} className="bg-red-600 text-white px-5 py-2 rounded-lg disabled:opacity-60">
              Reject
            </button>
            <button disabled={saving} onClick={() => save(status)} className="bg-gray-600 text-white px-5 py-2 rounded-lg disabled:opacity-60">
              Save without changing status
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Approving is blocked when the chosen cohort has no seats left.
          </p>
        </div>

        {/* Payments */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-bold mb-1">Fees &amp; payments</h3>
          <p className="text-xs text-gray-500 mb-4">
            Payments are recorded by hand (bank transfer, cash and so on). There is no online payment gateway yet.
          </p>

          {fin && !fin.hasCohort && (
            <p className="bg-yellow-50 text-yellow-800 rounded p-3 text-sm mb-4">
              Save a cohort for this application to calculate the fee.
            </p>
          )}

          {f && (
            <div className="grid sm:grid-cols-4 gap-3 mb-4">
              {[
                ["Full fee", naira(f.tuition)],
                [`Scholarship (${f.scholarshipPercent}%)`, `-${naira(f.discount)}`],
                ["Paid", naira(f.paid)],
                ["Balance", naira(f.balance)],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="font-bold">{v}</p>
                </div>
              ))}
              <p className="sm:col-span-4 text-sm">
                Payment status: <strong>{f.status}</strong>
                {f.overpaid > 0 && ` (overpaid by ${naira(f.overpaid)})`}
              </p>
            </div>
          )}

          {fin?.payments?.length > 0 && (
            <div className="space-y-2 mb-4">
              {fin.payments.map((p) => (
                <div key={p._id} className="flex justify-between items-center border rounded-lg p-3 text-sm">
                  <span>
                    <strong>{naira(p.amount)}</strong> · {p.method} · {formatDate(p.paidAt)}
                    {p.reference ? ` · ref ${p.reference}` : ""}
                  </span>
                  <button onClick={() => removePayment(p._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addPayment} className="grid sm:grid-cols-5 gap-3 items-end">
            {payError && <p className="sm:col-span-5 bg-red-50 text-red-700 rounded p-3 text-sm">{payError}</p>}
            <div>
              <label className="block text-xs font-semibold mb-1">Amount (₦)</label>
              <input type="number" min="1" required value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Method</label>
              <select value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })} className={inputClass}>
                <option>Bank transfer</option>
                <option>Cash</option>
                <option>Card / online</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Date</label>
              <input type="date" value={pay.paidAt} onChange={(e) => setPay({ ...pay, paidAt: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Reference</label>
              <input value={pay.reference} onChange={(e) => setPay({ ...pay, reference: e.target.value })} className={inputClass} />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2.5 rounded-lg">
              Record payment
            </button>
          </form>
        </div>

        <div className="flex justify-end mt-8">
          <button onClick={onClose} className="bg-gray-700 text-white px-6 py-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// Applications list
// ----------------------------------------------------------------
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    const [apps, coh] = await Promise.all([adminRequest("/apply"), adminRequest("/admin/cohorts")]);
    if (apps.ok && Array.isArray(apps.data)) {
      setApplications(apps.data);
      setError("");
    } else {
      setError(apps.data?.message || "Could not load applications");
    }
    if (coh.ok && Array.isArray(coh.data)) setCohorts(coh.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (statusFilter !== "All" && (a.status || "Pending") !== statusFilter) return false;
      if (scholarshipOnly && !wantsScholarship(a)) return false;
      if (!q) return true;
      return [a.fullName, a.email, a.course, a.applicationId, a.cohortName]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [applications, search, statusFilter, scholarshipOnly]);

  const counts = useMemo(() => {
    const c = {};
    applications.forEach((a) => {
      const s = a.status || "Pending";
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [applications]);

  const remove = async (a) => {
    if (!window.confirm(`Delete ${a.fullName}'s application? Their payment records stay in the database.`)) return;
    const { ok, data } = await adminRequest(`/apply/${a._id}`, { method: "DELETE" });
    if (!ok) window.alert(data?.message || "Could not delete");
    load();
  };

  const selected = applications.find((a) => a._id === selectedId);

  return (
    <div>
      <h1 className="text-4xl font-bold">Applications</h1>
      <p className="text-gray-600 mt-1 mb-6">Review applicants, award scholarships, assign cohorts and record payments.</p>

      {error && <p className="bg-red-50 text-red-700 rounded p-3 mb-6">{error}</p>}

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
            className={`bg-white rounded-xl shadow p-4 text-left border-2 ${statusFilter === s ? "border-blue-600" : "border-transparent"}`}
          >
            <p className="text-sm text-gray-500">{s}</p>
            <p className="text-3xl font-bold">{counts[s] || 0}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, track, cohort or ID..."
            className="flex-1 min-w-[220px] border rounded-lg p-3"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={scholarshipOnly} onChange={(e) => setScholarshipOnly(e.target.checked)} />
            Scholarship requests only
          </label>
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Applicant</th>
                <th className="p-3 text-left">Track / cohort</th>
                <th className="p-3 text-left">Mode · level</th>
                <th className="p-3 text-left">Scholarship</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    No applications match.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const status = a.status || "Pending";
                  return (
                    <tr key={a._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <p className="font-semibold">{a.fullName}</p>
                        <p className="text-sm text-gray-500">{a.email}</p>
                      </td>
                      <td className="p-3">
                        {a.course}
                        <span className="block text-xs text-gray-500">{a.cohortName || "No cohort"}</span>
                      </td>
                      <td className="p-3 text-sm">
                        {a.learningMode || "-"}
                        <span className="block text-gray-500">{a.experienceLevel || "-"}</span>
                      </td>
                      <td className="p-3 text-sm">
                        {a.scholarshipPercent > 0 ? (
                          <span className="font-semibold">{a.scholarshipPercent}% awarded</span>
                        ) : wantsScholarship(a) ? (
                          <span className="text-orange-600 font-semibold">Requested</span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-white text-sm ${statusColor[status] || "bg-gray-500"}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-2 whitespace-nowrap">
                        <button onClick={() => setSelectedId(a._id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                          Review
                        </button>
                        <button onClick={() => remove(a)} className="bg-red-600 text-white px-3 py-1 rounded">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <ReviewModal
          key={selected._id}
          application={selected}
          cohorts={cohorts}
          onClose={() => setSelectedId(null)}
          onChanged={load}
        />
      )}
    </div>
  );
};

export default Applications;
