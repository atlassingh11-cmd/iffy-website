"use client";

import * as React from "react";

import {
  addDays,
  CONSULTATION_TIME_WINDOWS,
  dateToIso,
  getDubaiPreferenceBounds,
  isoToDate,
  isValidDubaiPreferenceDate,
  type ConsultationPreference,
} from "@/lib/consultation-preference";
import { cn } from "@/lib/utils";

export {
  CONSULTATION_TIME_WINDOWS,
  getDubaiPreferenceBounds,
  isValidDubaiPreferenceDate,
} from "@/lib/consultation-preference";
export type {
  ConsultationPreference,
  ConsultationTimeWindow,
} from "@/lib/consultation-preference";

export interface ConsultationCalendarProps {
  value: ConsultationPreference;
  onChange: (value: ConsultationPreference) => void;
  error?: string;
  errorId?: string;
  labelledBy?: string;
  className?: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const CLOCK_NEUTRAL_MONTH = new Date(Date.UTC(2000, 0, 1, 12));
const DUBAI_UTC_OFFSET_MS = 4 * 60 * 60 * 1_000;

type PreferenceBounds = ReturnType<typeof getDubaiPreferenceBounds>;

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0, 12)).getUTCDate();
}

function clampIso(value: string, minimum: string, maximum: string): string {
  if (value < minimum) return minimum;
  if (value > maximum) return maximum;
  return value;
}

function isWithinBounds(
  value: string | undefined,
  bounds: PreferenceBounds,
): value is string {
  return Boolean(
    value &&
      isValidDubaiPreferenceDate(value) &&
      value >= bounds.min &&
      value <= bounds.max,
  );
}

function millisecondsUntilNextDubaiDay(now: Date): number {
  const [year, month, day] = getDubaiPreferenceBounds(now).min
    .split("-")
    .map(Number);
  const nextDubaiMidnight =
    Date.UTC(year, month - 1, day) - DUBAI_UTC_OFFSET_MS;
  return Math.max(1_000, nextDubaiMidnight - now.getTime() + 50);
}

function monthStart(value: string): Date {
  const date = isoToDate(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 12));
}

function formatMonth(value: Date): string {
  return MONTH_FORMATTER.format(value);
}

function formatLongDate(value: string): string {
  return LONG_DATE_FORMATTER.format(isoToDate(value));
}

export function focusConsultationDateControl(
  container: ParentNode | null,
): boolean {
  const control = container?.querySelector<HTMLElement>(
    "[data-date-input]:not([disabled])",
  );
  control?.focus();
  return Boolean(control);
}

function CalendarChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d={direction === "left" ? "m12 15-5-5 5-5" : "m8 5 5 5-5 5"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export const ConsultationCalendar = React.forwardRef<
  HTMLDivElement,
  ConsultationCalendarProps
>(function ConsultationCalendar(
  { value, onChange, error, errorId, labelledBy, className },
  forwardedRef,
) {
  const titleId = React.useId();
  const monthId = React.useId();
  const internalErrorId = React.useId();
  const selectedStatusId = React.useId();
  const describedBy = error ? errorId ?? internalErrorId : undefined;
  const [bounds, setBounds] = React.useState<PreferenceBounds | null>(null);
  const min = bounds?.min ?? "";
  const max = bounds?.max ?? "";
  const selectedDate = bounds && isWithinBounds(value.date, bounds)
    ? value.date
    : undefined;
  const selectedWindow = selectedDate ? value.window : undefined;

  const [currentMonth, setCurrentMonth] = React.useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = React.useState<string | null>(null);
  const [previousSelectedDate, setPreviousSelectedDate] =
    React.useState<string | undefined>(undefined);
  const [isNarrow, setIsNarrow] = React.useState<boolean | null>(null);
  const shouldFocusRef = React.useRef(false);
  const dayRefs = React.useRef(new Map<string, HTMLButtonElement>());

  React.useEffect(() => {
    let midnightTimer = 0;

    const refreshBounds = () => {
      const now = new Date();
      const nextBounds = getDubaiPreferenceBounds(now);
      setBounds((current) =>
        current?.min === nextBounds.min && current.max === nextBounds.max
          ? current
          : nextBounds,
      );
      window.clearTimeout(midnightTimer);
      midnightTimer = window.setTimeout(
        refreshBounds,
        millisecondsUntilNextDubaiDay(now),
      );
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refreshBounds();
    };

    refreshBounds();
    window.addEventListener("focus", refreshBounds);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearTimeout(midnightTimer);
      window.removeEventListener("focus", refreshBounds);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(max-width: 359px)");
    const update = () => setIsNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const selectionChanged = Boolean(
    bounds && selectedDate !== previousSelectedDate,
  );
  if (selectionChanged) {
    setPreviousSelectedDate(selectedDate);
  }

  const proposedFocusedDate =
    selectionChanged && selectedDate
      ? selectedDate
      : focusedDate ?? selectedDate ?? min;
  const clampedFocusedDate = bounds
    ? clampIso(proposedFocusedDate, min, max)
    : "";
  const focusWasClamped = Boolean(
    bounds && focusedDate && focusedDate !== clampedFocusedDate,
  );
  const displayedMonth = bounds
    ? focusWasClamped || !currentMonth
      ? monthStart(clampedFocusedDate)
      : currentMonth
    : CLOCK_NEUTRAL_MONTH;

  if (
    bounds &&
    clampedFocusedDate &&
    (focusedDate !== clampedFocusedDate ||
      !currentMonth ||
      (selectionChanged && Boolean(selectedDate)))
  ) {
    if (focusedDate !== clampedFocusedDate) {
      setFocusedDate(clampedFocusedDate);
    }
    if (focusWasClamped || !currentMonth || selectionChanged) {
      setCurrentMonth(monthStart(clampedFocusedDate));
    }
  }

  React.useEffect(() => {
    if (!shouldFocusRef.current || isNarrow) return;
    const control = dayRefs.current.get(clampedFocusedDate);
    if (control) {
      shouldFocusRef.current = false;
      control.focus({ preventScroll: true });
    }
  }, [clampedFocusedDate, currentMonth, isNarrow]);

  const {
    currentYear,
    currentMonthIndex,
    currentMonthLabel,
    monthDates,
    leadingCells,
  } = React.useMemo(() => {
    const year = displayedMonth.getUTCFullYear();
    const monthIndex = displayedMonth.getUTCMonth();
    const firstWeekday =
      (new Date(Date.UTC(year, monthIndex, 1, 12)).getUTCDay() + 6) % 7;
    const monthDayCount = daysInMonth(year, monthIndex);

    return {
      currentYear: year,
      currentMonthIndex: monthIndex,
      currentMonthLabel: formatMonth(displayedMonth),
      monthDates: Array.from({ length: monthDayCount }, (_, index) =>
        dateToIso(new Date(Date.UTC(year, monthIndex, index + 1, 12))),
      ),
      leadingCells: Array.from(
        { length: firstWeekday },
        (_, index) => index,
      ),
    };
  }, [displayedMonth]);

  const moveFocus = React.useCallback(
    (nextDate: string) => {
      const clamped = clampIso(nextDate, min, max);
      shouldFocusRef.current = true;
      setFocusedDate(clamped);
      setCurrentMonth(monthStart(clamped));
    },
    [max, min],
  );

  const moveByMonth = React.useCallback(
    (amount: number) => {
      const focused = isoToDate(clampedFocusedDate);
      const targetYear = focused.getUTCFullYear();
      const targetMonth = focused.getUTCMonth() + amount;
      const targetMonthStart = new Date(
        Date.UTC(targetYear, targetMonth, 1, 12),
      );
      const day = Math.min(
        focused.getUTCDate(),
        daysInMonth(
          targetMonthStart.getUTCFullYear(),
          targetMonthStart.getUTCMonth(),
        ),
      );
      targetMonthStart.setUTCDate(day);
      moveFocus(dateToIso(targetMonthStart));
    },
    [clampedFocusedDate, moveFocus],
  );

  const handleDayKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let handled = true;
    switch (event.key) {
      case "ArrowLeft":
        moveFocus(addDays(clampedFocusedDate, -1));
        break;
      case "ArrowRight":
        moveFocus(addDays(clampedFocusedDate, 1));
        break;
      case "ArrowUp":
        moveFocus(addDays(clampedFocusedDate, -7));
        break;
      case "ArrowDown":
        moveFocus(addDays(clampedFocusedDate, 7));
        break;
      case "Home": {
        const weekday = (isoToDate(clampedFocusedDate).getUTCDay() + 6) % 7;
        moveFocus(addDays(clampedFocusedDate, -weekday));
        break;
      }
      case "End": {
        const weekday = (isoToDate(clampedFocusedDate).getUTCDay() + 6) % 7;
        moveFocus(addDays(clampedFocusedDate, 6 - weekday));
        break;
      }
      case "PageUp":
        moveByMonth(event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        moveByMonth(event.shiftKey ? 12 : 1);
        break;
      default:
        handled = false;
    }

    if (handled) event.preventDefault();
  };

  const chooseDate = (date: string) => {
    if (!bounds || !isWithinBounds(date, bounds)) return;
    setFocusedDate(date);
    onChange({
      date,
      ...(selectedDate && selectedWindow ? { window: selectedWindow } : {}),
    });
  };

  const currentMonthFirst = dateToIso(displayedMonth);
  const previousMonthAllowed =
    bounds ? currentMonthFirst > dateToIso(monthStart(min)) : false;
  const nextMonth = new Date(
    Date.UTC(currentYear, currentMonthIndex + 1, 1, 12),
  );
  const nextMonthAllowed = bounds ? dateToIso(nextMonth) <= max : false;
  const useNativeDateInput = !bounds || isNarrow !== false;

  return (
    <div
      aria-describedby={describedBy}
      aria-labelledby={labelledBy ?? titleId}
      className={cn(
        "w-full max-w-[26rem] text-[#102125] forced-colors:text-[CanvasText]",
        className,
      )}
      ref={forwardedRef}
      role="group"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em]" id={titleId}>
            Preferred day
          </h3>
          <p className="mt-1 text-sm text-[#496066]">
            Choose a day in Dubai, or continue without one.
          </p>
        </div>

        {selectedDate ? (
          <button
            className="min-h-11 shrink-0 rounded-full px-3 text-sm font-medium underline decoration-[#8caeb4] underline-offset-4 outline-none hover:decoration-current focus-visible:ring-2 focus-visible:ring-[#102125] forced-colors:border"
            onClick={() => onChange({})}
            type="button"
          >
            Clear day
          </button>
        ) : null}
      </div>

      {useNativeDateInput ? (
        <div className="mt-5">
          <label className="sr-only" htmlFor={`${titleId}-native`}>
            Preferred day in Dubai
          </label>
          <input
            aria-describedby={describedBy}
            aria-invalid={error ? "true" : undefined}
            className="min-h-12 w-full rounded-xl bg-[#eef1ed] px-3 text-base outline-none ring-1 ring-[#71858a] focus-visible:ring-2 focus-visible:ring-[#102125] forced-colors:border"
            data-date-input=""
            id={`${titleId}-native`}
            max={bounds?.max}
            min={bounds?.min}
            onChange={(event) => chooseDate(event.currentTarget.value)}
            type="date"
            value={bounds ? selectedDate ?? "" : value.date ?? ""}
          />
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p
              aria-live="polite"
              className="text-xl font-semibold tracking-[-0.025em]"
              id={monthId}
            >
              {currentMonthLabel}
            </p>
            <div className="flex gap-1">
              <button
                aria-label="Show previous month"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#e7ebe7] outline-none hover:bg-[#dce3df] focus-visible:ring-2 focus-visible:ring-[#102125] disabled:opacity-35 forced-colors:border"
                disabled={!previousMonthAllowed}
                onClick={() => moveByMonth(-1)}
                type="button"
              >
                <CalendarChevron direction="left" />
              </button>
              <button
                aria-label="Show next month"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#e7ebe7] outline-none hover:bg-[#dce3df] focus-visible:ring-2 focus-visible:ring-[#102125] disabled:opacity-35 forced-colors:border"
                disabled={!nextMonthAllowed}
                onClick={() => moveByMonth(1)}
                type="button"
              >
                <CalendarChevron direction="right" />
              </button>
            </div>
          </div>

          <div
            aria-describedby={
              [selectedStatusId, describedBy].filter(Boolean).join(" ") || undefined
            }
            aria-labelledby={monthId}
            className="mt-3 grid grid-cols-7 gap-y-1"
            role="grid"
          >
            {WEEKDAYS.map((weekday) => (
              <div
                aria-hidden="true"
                className="flex h-8 items-center justify-center text-xs font-semibold uppercase tracking-[0.08em] text-[#61747a]"
                key={weekday}
                role="columnheader"
              >
                {weekday}
              </div>
            ))}
            {leadingCells.map((cell) => (
              <span aria-hidden="true" key={`empty-${cell}`} />
            ))}
            {monthDates.map((date) => {
              const isAvailable = date >= min && date <= max;
              const isSelected = date === selectedDate;
              const isFocused = date === clampedFocusedDate;

              return (
                <div
                  aria-selected={isSelected}
                  className="flex items-center justify-center"
                  key={date}
                  role="gridcell"
                >
                  <button
                    aria-label={formatLongDate(date)}
                    className={cn(
                      "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#102125] focus-visible:ring-offset-2 disabled:text-[#9ba7a4] forced-colors:border",
                      isSelected
                        ? "bg-[#123e48] text-white"
                        : "hover:bg-[#e2e9e6]",
                    )}
                    data-date-input={isFocused ? "" : undefined}
                    disabled={!isAvailable}
                    onClick={() => chooseDate(date)}
                    onFocus={() => setFocusedDate(date)}
                    onKeyDown={handleDayKeyDown}
                    ref={(node) => {
                      if (node) dayRefs.current.set(date, node);
                      else dayRefs.current.delete(date);
                    }}
                    tabIndex={isFocused && isAvailable ? 0 : -1}
                    type="button"
                  >
                    {Number(date.slice(-2))}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p aria-live="polite" className="sr-only" id={selectedStatusId}>
        {selectedDate
          ? `Preferred day selected, ${formatLongDate(selectedDate)}`
          : "No preferred day selected"}
      </p>

      <fieldset className="mt-6" disabled={!selectedDate}>
        <legend className="text-sm font-semibold">Dubai time preference</legend>
        <p className="mt-1 text-sm text-[#61747a]">
          These are broad windows. Iffy will agree the exact time with you.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {CONSULTATION_TIME_WINDOWS.map((option) => (
            <label
              className={cn(
                "flex min-h-12 cursor-pointer items-center rounded-xl bg-[#eef1ed] px-3 text-sm font-medium outline-none ring-1 ring-transparent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#102125] forced-colors:border",
                !selectedDate && "cursor-not-allowed opacity-45",
                selectedWindow === option.value && "bg-[#d9e7e5] ring-[#557c83]",
              )}
              key={option.value}
            >
              <input
                checked={selectedWindow === option.value}
                className="mr-2 h-4 w-4 accent-[#123e48]"
                disabled={!selectedDate}
                name={`${titleId}-window`}
                onChange={() => {
                  if (selectedDate) {
                    onChange({ date: selectedDate, window: option.value });
                  }
                }}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {error ? (
        <p
          className="mt-3 text-sm font-semibold text-[#9b2c2c]"
          id={describedBy}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
});

ConsultationCalendar.displayName = "ConsultationCalendar";
