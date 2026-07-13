import { contact } from "@/content/contact";
import {
  CONSULTATION_TIME_WINDOWS,
  getDubaiPreferenceDateStatus,
  type ConsultationTimeWindow,
} from "@/lib/consultation-preference";

export const IFFY_PHONE_DISPLAY = contact.phoneDisplay;
export const IFFY_PHONE_E164 = contact.whatsappNumber;
export const IFFY_EMAIL = contact.email;

export const LEAD_INTENTS = ["buying", "investing", "selling", "not-sure"] as const;
export type LeadIntent = (typeof LEAD_INTENTS)[number];

export const TIME_WINDOWS = CONSULTATION_TIME_WINDOWS;
export type TimeWindow = ConsultationTimeWindow;

export interface LeadInput {
  name: string;
  intent: LeadIntent | string;
  date?: string;
  window?: TimeWindow | string;
}

export interface ValidLead {
  name: string;
  intent: LeadIntent;
  date?: string;
  window?: TimeWindow;
}

export type LeadField = "name" | "intent" | "date" | "window";

export type LeadValidationResult =
  | { ok: true; value: ValidLead }
  | { ok: false; field: LeadField; message: string };

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f]/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_NAME_LENGTH = 80;

export function isLeadIntent(value: unknown): value is LeadIntent {
  return typeof value === "string" && LEAD_INTENTS.includes(value as LeadIntent);
}

export function isTimeWindow(value: unknown): value is TimeWindow {
  return typeof value === "string" && TIME_WINDOWS.some((option) => option.value === value);
}

export function normalizeLeadName(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH);
}

export function validatePreferredDate(value: string, now = new Date()): string | null {
  const status = getDubaiPreferenceDateStatus(value, now);
  if (status === "invalid") return "Choose a valid preferred day.";
  if (status === "before-minimum") return "Choose a day from tomorrow onwards in Dubai.";
  if (status === "after-maximum") return "Choose a day within the next 60 days.";
  return null;
}

export function validateLead(input: LeadInput, now = new Date()): LeadValidationResult {
  if (CONTROL_CHARACTERS.test(input.name)) {
    return { ok: false, field: "name", message: "Enter your name without control characters." };
  }
  const name = normalizeLeadName(input.name);
  if (!name) return { ok: false, field: "name", message: "Enter your name." };
  if (!isLeadIntent(input.intent)) {
    return { ok: false, field: "intent", message: "Choose what you would like help with." };
  }
  if (input.window && !input.date) {
    return { ok: false, field: "date", message: "Choose a preferred day before a time window." };
  }
  if (input.date) {
    const dateError = validatePreferredDate(input.date, now);
    if (dateError) return { ok: false, field: "date", message: dateError };
  }
  if (input.window && !isTimeWindow(input.window)) {
    return { ok: false, field: "window", message: "Choose a valid Dubai-time window." };
  }
  return {
    ok: true,
    value: {
      name,
      intent: input.intent,
      ...(input.date ? { date: input.date } : {}),
      ...(input.window ? { window: input.window as TimeWindow } : {}),
    },
  };
}

const INTENT_COPY: Record<LeadIntent, string> = {
  buying: "buying a home",
  investing: "buying an investment property",
  selling: "selling a property",
  "not-sure": "working out the right property move",
};

function formatPreferredDate(value: string): string {
  const match = ISO_DATE.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function buildLeadDraft(lead: ValidLead): string {
  const lines = [
    `Hi Iffy, I am ${lead.name}.`,
    `I would like your advice on ${INTENT_COPY[lead.intent]}.`,
  ];
  if (lead.date) {
    lines.push(`Preferred day: ${formatPreferredDate(lead.date)}.`);
    if (lead.window) {
      const label = TIME_WINDOWS.find((option) => option.value === lead.window)?.label;
      lines.push(`Preferred time: ${label} Dubai time.`);
    } else {
      lines.push("I do not have a preferred time window.");
    }
    lines.push("This is only a preference. The exact time still needs to be agreed.");
  } else {
    lines.push("I have not chosen a preferred day or time.");
  }
  lines.push("Could we talk through my property plans?");
  return lines.join("\n");
}

export function buildWhatsAppUrl(draft: string): string {
  return `https://wa.me/${IFFY_PHONE_E164}?text=${encodeURIComponent(draft)}`;
}

export function buildEmailUrl(draft: string): string {
  return `mailto:${IFFY_EMAIL}?subject=${encodeURIComponent("Property consultation with Iffy")}&body=${encodeURIComponent(draft)}`;
}

export function readIntent(value: string | null | undefined): LeadIntent | undefined {
  return isLeadIntent(value) ? value : undefined;
}
