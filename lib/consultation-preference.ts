export const CONSULTATION_TIME_WINDOWS = [
  { value: "morning", label: "Morning, 9am to 12pm" },
  { value: "afternoon", label: "Afternoon, 12pm to 4pm" },
  { value: "evening", label: "Evening, 4pm to 7pm" },
] as const;

export type ConsultationTimeWindow =
  (typeof CONSULTATION_TIME_WINDOWS)[number]["value"];

export type ConsultationPreference = {
  date?: string;
  window?: ConsultationTimeWindow;
};

export type DubaiPreferenceDateStatus =
  | "valid"
  | "invalid"
  | "before-minimum"
  | "after-maximum";

const DUBAI_TIME_ZONE = "Asia/Dubai";
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DUBAI_DAY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: DUBAI_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function isoToDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function dateToIso(value: Date): string {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(value: string, amount: number): string {
  const date = isoToDate(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return dateToIso(date);
}

function dubaiToday(now: Date): string {
  const parts = DUBAI_DAY_FORMATTER.formatToParts(now);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function getDubaiPreferenceBounds(now = new Date()): {
  min: string;
  max: string;
} {
  const today = dubaiToday(now);
  return { min: addDays(today, 1), max: addDays(today, 60) };
}

export function getDubaiPreferenceDateStatus(
  value: string | undefined,
  now = new Date(),
): DubaiPreferenceDateStatus {
  if (!value || !ISO_DATE_PATTERN.test(value)) return "invalid";
  const parsed = isoToDate(value);
  if (Number.isNaN(parsed.getTime()) || dateToIso(parsed) !== value) {
    return "invalid";
  }
  const { min, max } = getDubaiPreferenceBounds(now);
  if (value < min) return "before-minimum";
  if (value > max) return "after-maximum";
  return "valid";
}

export function isValidDubaiPreferenceDate(
  value: string | undefined,
  now = new Date(),
): value is string {
  return getDubaiPreferenceDateStatus(value, now) === "valid";
}
