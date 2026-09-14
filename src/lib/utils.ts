export const cx = (...names: Array<string | false | null | undefined>) =>
  names.filter(Boolean).join(" ");

// Months from a "YYYY-MM" start up to the current month, inclusive.
export function monthsSince(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  const now = new Date();
  return (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month) + 1;
}
