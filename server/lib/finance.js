// Pure helper functions (no database) so they can be tested on their own.

export const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// Works out what a student owes after any scholarship, and what is left to pay.
export function computeFinance({ tuition, scholarshipPercent, payments = [] }) {
  const fee = Math.max(0, Number(tuition) || 0);
  const pct = Math.min(100, Math.max(0, Number(scholarshipPercent) || 0));
  const discount = round2((fee * pct) / 100);
  const amountDue = round2(fee - discount);
  const paid = round2(payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0));
  const balance = round2(Math.max(0, amountDue - paid));
  const overpaid = round2(Math.max(0, paid - amountDue));

  let status = "Unpaid";
  if (amountDue === 0) status = "No payment due";
  else if (balance === 0) status = "Paid in full";
  else if (paid > 0) status = "Part paid";

  return {
    tuition: fee,
    scholarshipPercent: pct,
    discount,
    amountDue,
    paid,
    balance,
    overpaid,
    status,
  };
}

// How many seats are still free in a cohort.
export const seatsLeft = (seats, approvedCount) =>
  Math.max(0, (Number(seats) || 0) - (Number(approvedCount) || 0));

// Progress through a list of lessons given the ids a student completed.
export function computeProgress(lessonIds, completedIds) {
  const done = new Set(completedIds.map(String));
  const total = lessonIds.length;
  const completed = lessonIds.filter((id) => done.has(String(id))).length;
  return {
    total,
    completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export const APPLICATION_STATUSES = ["Pending", "Approved", "Waitlisted", "Rejected"];
