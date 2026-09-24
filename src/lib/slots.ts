// Booking calendar helpers. Runs in the browser (React island) and on the server.
import { site } from "@/config/site";

export interface DayOption {
  iso: string;
  label: string;
  weekday: string;
  dayNum: string;
  month: string;
  open: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");
export const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function hoursFor(date: Date) {
  // site.hours is Monday-first; JS getDay() is Sunday=0.
  const idx = (date.getDay() + 6) % 7;
  return site.hours[idx];
}

export function nextDays(count = 30, from = new Date()): DayOption[] {
  const out: DayOption[] = [];
  const start = new Date(from);
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const h = hoursFor(d);
    out.push({
      iso: toIso(d),
      label: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: String(d.getDate()),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      open: h.open !== null,
    });
  }
  return out;
}

export function slotsFor(iso: string, durationMinutes = 60): string[] {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const h = hoursFor(date);
  if (!h.open || !h.close) return [];
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;
  const out: string[] = [];
  for (let t = openMin; t + durationMinutes <= closeMin; t += site.slotMinutes) {
    out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return out;
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad(m)} ${suffix}`;
}

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function isValidSlot(iso: string, time: string, durationMinutes = 60): boolean {
  const days = nextDays(30);
  if (!days.some((d) => d.iso === iso && d.open)) return false;
  return slotsFor(iso, durationMinutes).includes(time);
}
