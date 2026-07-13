import { describe, expect, it } from "vitest";
import {
  buildEmailUrl,
  buildLeadDraft,
  buildWhatsAppUrl,
  normalizeLeadName,
  readIntent,
  validateLead,
  validatePreferredDate,
} from "@/lib/lead";

const DUBAI_JULY_13 = new Date("2026-07-12T20:30:00.000Z");

describe("lead validation", () => {
  it("normalizes and limits names without accepting control characters", () => {
    expect(normalizeLeadName("  Iffy   Khan  ")).toBe("Iffy Khan");
    expect(normalizeLeadName("A".repeat(100))).toHaveLength(80);
    expect(validateLead({ name: "Iffy\nKhan", intent: "buying" }, DUBAI_JULY_13)).toMatchObject({ ok: false, field: "name" });
  });

  it("allowlists intent and time-window values", () => {
    expect(validateLead({ name: "Amina", intent: "renting" }, DUBAI_JULY_13)).toMatchObject({ ok: false, field: "intent" });
    expect(validateLead({ name: "Amina", intent: "buying", date: "2026-07-14", window: "midnight" }, DUBAI_JULY_13)).toMatchObject({ ok: false, field: "window" });
    expect(readIntent("investing")).toBe("investing");
    expect(readIntent("buying<script>")).toBeUndefined();
  });

  it("accepts no date, a date alone, or a date with a window, but not a window alone", () => {
    expect(validateLead({ name: "Amina", intent: "selling" }, DUBAI_JULY_13).ok).toBe(true);
    expect(validateLead({ name: "Amina", intent: "selling", date: "2026-07-14" }, DUBAI_JULY_13).ok).toBe(true);
    expect(validateLead({ name: "Amina", intent: "selling", date: "2026-07-14", window: "morning" }, DUBAI_JULY_13).ok).toBe(true);
    expect(validateLead({ name: "Amina", intent: "selling", window: "morning" }, DUBAI_JULY_13)).toMatchObject({ ok: false, field: "date" });
  });

  it("revalidates tomorrow through 60 days against the Dubai calendar day", () => {
    expect(validatePreferredDate("2026-07-13", DUBAI_JULY_13)).toContain("tomorrow");
    expect(validatePreferredDate("2026-07-14", DUBAI_JULY_13)).toBeNull();
    expect(validatePreferredDate("2026-09-11", DUBAI_JULY_13)).toBeNull();
    expect(validatePreferredDate("2026-09-12", DUBAI_JULY_13)).toContain("60 days");
    expect(validatePreferredDate("2026-02-30", DUBAI_JULY_13)).toContain("valid");
  });
});

describe("lead draft handoff", () => {
  const lead = { name: "Amina & Sam", intent: "investing" as const, date: "2026-07-14", window: "morning" as const };

  it("describes investing as a buying objective and does not overclaim the appointment", () => {
    const draft = buildLeadDraft(lead);
    expect(draft).toContain("buying an investment property");
    expect(draft).toContain("Morning, 9am to 12pm Dubai time");
    expect(draft).toContain("The exact time still needs to be agreed");
    expect(draft).not.toMatch(/sent|booked|confirmed/i);
  });

  it("creates URL-encoded external drafts only when requested", () => {
    const draft = buildLeadDraft(lead);
    const whatsApp = buildWhatsAppUrl(draft);
    const email = buildEmailUrl(draft);
    expect(whatsApp).toContain("Amina%20%26%20Sam");
    expect(email).toContain("subject=Property%20consultation%20with%20Iffy");
    expect(decodeURIComponent(email)).toContain(draft);
  });
});
