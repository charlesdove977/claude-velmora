// Builds an iCalendar file for a booking request. Arizona has no daylight
// saving, so America/Phoenix is a fixed UTC-7 offset year-round.
import { site } from "@/config/site";

const pad = (n: number) => String(n).padStart(2, "0");

function toUtcStamp(iso: string, hhmm: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const [h, min] = hhmm.split(":").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d, h + 7, min, 0));
  return `${utc.getUTCFullYear()}${pad(utc.getUTCMonth() + 1)}${pad(utc.getUTCDate())}T${pad(utc.getUTCHours())}${pad(utc.getUTCMinutes())}00Z`;
}

function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

const escapeIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function buildIcs(opts: { ref: string; date: string; time: string; durationMinutes: number; summary: string; description: string }): string {
  const start = toUtcStamp(opts.date, opts.time);
  const end = toUtcStamp(opts.date, addMinutes(opts.time, opts.durationMinutes));
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const location = `${site.name}, ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${site.name}//Booking//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${opts.ref}@${site.url.replace(/^https?:\/\//, "")}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcs(opts.summary)}`,
    `DESCRIPTION:${escapeIcs(opts.description)}`,
    `LOCATION:${escapeIcs(location)}`,
    `URL:${site.url}/book/confirmed?ref=${opts.ref}`,
    "STATUS:TENTATIVE",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`Reminder: ${opts.summary} tomorrow`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
