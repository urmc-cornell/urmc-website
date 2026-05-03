/**
 * Returns the current semester code (e.g. "sp26", "su26", "fa26").
 * Mirrors the logic in urmc-sign-in/backend/point_service.py::current_semester().
 *
 *  Jan–May  → sp (Spring)
 *  Jun–Jul  → su (Summer)
 *  Aug–Dec  → fa (Fall)
 */
export function currentSemester() {
  const today = new Date();
  const year = String(today.getFullYear()).slice(-2);
  const month = today.getMonth() + 1; // getMonth() is 0-indexed

  if (month >= 1 && month <= 5) return `sp${year}`;
  if (month >= 6 && month <= 7) return `su${year}`;
  return `fa${year}`;
}

const SEMESTER_LABELS = {
  sp: "Spring",
  su: "Summer",
  fa: "Fall",
};

/**
 * Returns a human-readable label for a semester code.
 * currentSemesterLabel()        → "Spring 2026"
 * currentSemesterLabel("fa25") → "Fall 2025"
 */
export function semesterLabel(code) {
  const prefix = code.slice(0, 2);
  const year = `20${code.slice(2)}`;
  return `${SEMESTER_LABELS[prefix] ?? prefix} ${year}`;
}

/** Convenience: label for the current semester. */
export function currentSemesterLabel() {
  return semesterLabel(currentSemester());
}
