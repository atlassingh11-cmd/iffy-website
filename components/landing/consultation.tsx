"use client";

import {
  FormEvent,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  ConsultationCalendar,
  focusConsultationDateControl,
  type ConsultationPreference,
} from "@/components/ui/consultation-calendar";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import {
  buildEmailUrl,
  buildLeadDraft,
  buildWhatsAppUrl,
  IFFY_EMAIL,
  IFFY_PHONE_DISPLAY,
  IFFY_PHONE_E164,
  readIntent,
  type LeadField,
  type LeadIntent,
  type ValidLead,
  validateLead,
} from "@/lib/lead";

const INTENT_OPTIONS: Array<{ value: LeadIntent; label: string; detail: string }> = [
  { value: "buying", label: "Buying", detail: "A home, ready property or off-plan purchase" },
  { value: "investing", label: "Investing", detail: "Buying with yield, growth or portfolio goals" },
  { value: "selling", label: "Selling", detail: "Pricing, positioning and transfer guidance" },
  { value: "not-sure", label: "Not sure yet", detail: "Start with the objective and work out the route" },
];

interface FieldError {
  field: LeadField;
  message: string;
}

function IntentSearchSync({
  onIntentChange,
}: {
  onIntentChange: (intent: LeadIntent) => void;
}) {
  const searchParams = useSearchParams();
  const queryIntent = readIntent(searchParams.get("intent"));

  useEffect(() => {
    if (!queryIntent) return;
    const timer = window.setTimeout(() => onIntentChange(queryIntent), 0);
    return () => window.clearTimeout(timer);
  }, [onIntentChange, queryIntent]);

  return null;
}

export function Consultation() {
  const id = useId();
  const [name, setName] = useState("");
  const [intent, setIntent] = useState<LeadIntent | "">("");
  const [preference, setPreference] = useState<ConsultationPreference>({});
  const [lead, setLead] = useState<ValidLead | null>(null);
  const [error, setError] = useState<FieldError | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const intentRef = useRef<HTMLFieldSetElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const syncIntent = useCallback((nextIntent: LeadIntent) => {
    setIntent(nextIntent);
    setLead(null);
    setError(null);
    setCopyStatus("");
  }, []);

  const draft = useMemo(() => (lead ? buildLeadDraft(lead) : ""), [lead]);

  function focusError(field: LeadField) {
    requestAnimationFrame(() => {
      if (field === "name") nameRef.current?.focus();
      else if (field === "intent") intentRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      else if (calendarRef.current) focusConsultationDateControl(calendarRef.current);
    });
  }

  function continueToChannels(includePreference: boolean) {
    const nextPreference = includePreference ? preference : {};
    const result = validateLead({ name, intent, ...nextPreference });
    if (!result.ok) {
      setError({ field: result.field, message: result.message });
      focusError(result.field);
      return;
    }
    if (!includePreference) setPreference({});
    setName(result.value.name);
    setLead(result.value);
    setError(null);
    setCopyStatus("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    continueToChannels(true);
  }

  function openDraft(channel: "whatsapp" | "email") {
    if (!lead) return;
    const result = validateLead(lead);
    if (!result.ok) {
      setLead(null);
      setError({ field: result.field, message: result.message });
      focusError(result.field);
      return;
    }
    const currentDraft = buildLeadDraft(result.value);
    const url =
      channel === "whatsapp"
        ? buildWhatsAppUrl(currentDraft)
        : buildEmailUrl(currentDraft);
    const externalWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (externalWindow) externalWindow.opener = null;
  }

  async function copyDraft() {
    if (!lead) return;
    const result = validateLead(lead);
    if (!result.ok) {
      setLead(null);
      setError({ field: result.field, message: result.message });
      focusError(result.field);
      return;
    }
    const currentDraft = buildLeadDraft(result.value);
    try {
      await navigator.clipboard.writeText(currentDraft);
      setCopyStatus("Draft copied to your clipboard.");
    } catch {
      setCopyStatus("Select the draft text below to copy it.");
    }
  }

  const fieldClass = "min-h-12 w-full bg-[color-mix(in_oklch,var(--paper)_78%,transparent)] px-4 py-3 text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]";

  return (
    <section id="consultation" aria-labelledby={`${id}-heading`} className="consultation-atmosphere py-20 text-[var(--ink)] sm:py-28">
      <Suspense fallback={null}>
        <IntentSearchSync onIntentChange={syncIntent} />
      </Suspense>
      <div className="mx-auto grid w-[min(100%-2rem,72rem)] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <h2 id={`${id}-heading`} className="text-4xl font-medium tracking-tight sm:text-6xl">Tell Iffy what you are considering.</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">Choose a preferred day and Dubai-time window, or continue without one. Iffy will reply personally to agree the exact time.</p>
          <p className="mt-8 text-sm leading-6 text-[var(--muted)]">Nothing is submitted to this website. You choose whether to pass your draft to WhatsApp or your email app at the next step.</p>
        </div>

        {!lead ? (
          <form onSubmit={submit} noValidate className="space-y-10" aria-describedby={error && error.field !== "date" && error.field !== "window" ? `${id}-form-error` : undefined}>
            <label className="block space-y-3 text-sm font-medium" htmlFor={`${id}-name`}>
              Your name
              <input
                ref={nameRef}
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
                aria-invalid={error?.field === "name" || undefined}
                aria-describedby={error?.field === "name" ? `${id}-form-error` : undefined}
              />
            </label>

            <fieldset ref={intentRef} className="space-y-4" aria-invalid={error?.field === "intent" || undefined} aria-describedby={error?.field === "intent" ? `${id}-form-error` : undefined}>
              <legend className="text-sm font-medium">What would you like help with?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {INTENT_OPTIONS.map((option) => {
                  const selected = intent === option.value;
                  return (
                    <label key={option.value} className={`cursor-pointer p-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent-strong)] ${selected ? "bg-[var(--ink)] text-[var(--limestone)]" : "bg-[color-mix(in_oklch,var(--paper)_72%,transparent)] text-[var(--ink)] hover:bg-[var(--paper)]"}`}>
                      <input className="sr-only" type="radio" name="intent" value={option.value} checked={selected} onChange={() => setIntent(option.value)} />
                      <span className="block font-medium">{option.label}</span>
                      <span className={`mt-1 block text-sm ${selected ? "text-[var(--limestone-deep)]" : "text-[var(--muted)]"}`}>{option.detail}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div ref={calendarRef}>
              <h3 id={`${id}-preference`} className="text-xl font-medium">Preferred time, if you have one</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">This is a preference, not live availability.</p>
              <ConsultationCalendar
                className="mt-5 bg-[color-mix(in_oklch,var(--paper)_82%,transparent)] p-4 sm:p-6"
                value={preference}
                onChange={(value) => {
                  setPreference(value);
                  if (error?.field === "date" || error?.field === "window") setError(null);
                }}
                labelledBy={`${id}-preference`}
                error={error?.field === "date" || error?.field === "window" ? error.message : undefined}
                errorId={`${id}-calendar-error`}
              />
            </div>

            {error && error.field !== "date" && error.field !== "window" ? <p id={`${id}-form-error`} role="alert" className="text-sm text-[var(--danger)]">{error.message}</p> : null}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <LiquidGlass type="submit" tone="dark" className="min-h-12 px-6">Continue with this preference</LiquidGlass>
              <button type="button" onClick={() => continueToChannels(false)} className="min-h-11 px-2 py-3 text-sm font-medium text-[var(--ink-soft)] underline decoration-[var(--sea-glass)] underline-offset-4 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Message without a preferred time</button>
            </div>
          </form>
        ) : (
          <div className="space-y-8" aria-labelledby={`${id}-channel-heading`}>
            <div>
              <h3 id={`${id}-channel-heading`} className="text-3xl font-medium">Choose how to continue.</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">WhatsApp and email are external services. Your name and preference leave this site only when you choose one below.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LiquidGlass type="button" onClick={() => openDraft("whatsapp")} tone="dark" className="min-h-12 px-6">Continue on WhatsApp</LiquidGlass>
              <button type="button" onClick={() => openDraft("email")} className="min-h-11 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--limestone)] hover:bg-[var(--gulf)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Draft an email</button>
            </div>
            <div className="bg-[color-mix(in_oklch,var(--paper)_78%,transparent)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4"><h4 className="font-medium">Your draft</h4><button type="button" onClick={copyDraft} className="min-h-11 rounded-full bg-[var(--limestone-deep)] px-4 py-2 text-sm font-medium hover:bg-[var(--sea-glass)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Copy draft</button></div>
              <pre className="mt-5 whitespace-pre-wrap font-sans text-sm leading-6 text-[var(--ink-soft)]">{draft}</pre>
              <p aria-live="polite" className="mt-3 text-sm text-[var(--muted)]">{copyStatus}</p>
            </div>
            <div className="space-y-3 text-sm text-[var(--ink-soft)]">
              <p>If the external app does not open, use a direct contact:</p>
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                <a className="underline decoration-[var(--sea-glass)] underline-offset-4 hover:text-[var(--ink)]" href={`https://wa.me/${IFFY_PHONE_E164}`} target="_blank" rel="noopener noreferrer">WhatsApp {IFFY_PHONE_DISPLAY}</a>
                <a className="underline decoration-[var(--sea-glass)] underline-offset-4 hover:text-[var(--ink)]" href={`mailto:${IFFY_EMAIL}`}>{IFFY_EMAIL}</a>
                <a className="underline decoration-[var(--sea-glass)] underline-offset-4 hover:text-[var(--ink)]" href={`tel:+${IFFY_PHONE_E164}`}>Call {IFFY_PHONE_DISPLAY}</a>
              </div>
            </div>
            <button type="button" onClick={() => { setLead(null); setCopyStatus(""); }} className="min-h-11 px-2 py-3 text-sm text-[var(--muted)] underline decoration-[var(--sea-glass)] underline-offset-4 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Change my details</button>
          </div>
        )}
      </div>
    </section>
  );
}
