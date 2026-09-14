// Opening-hours helpers for F&B pages. Times are "HH:MM" (24-hour); a range whose close is earlier
// than its open runs past midnight, e.g. { open: "17:00", close: "02:00" }.

export type DailyHours = { open: string; close: string };

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export function minutesInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return read("hour") * 60 + read("minute");
}

// "17:00" -> "5:00 pm"
export function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "pm" : "am"}`;
}

// Whether the shop is open at `now` in the shop's time zone, and when that next changes.
export function openStatus(hours: DailyHours[], now = new Date(), timeZone = "Asia/Kuala_Lumpur") {
  const minute = minutesInTimeZone(now, timeZone);

  for (const range of hours) {
    const open = toMinutes(range.open);
    const close = toMinutes(range.close);
    const isOpen = close > open ? minute >= open && minute < close : minute >= open || minute < close;
    if (isOpen) return { isOpen: true, changeAt: range.close };
  }

  const byOpening = [...hours].sort((a, b) => toMinutes(a.open) - toMinutes(b.open));
  const next = byOpening.find((range) => toMinutes(range.open) > minute) ?? byOpening[0];
  return { isOpen: false, changeAt: next?.open ?? null };
}
