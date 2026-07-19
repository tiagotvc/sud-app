import { format } from "date-fns";
import type { Locale } from "date-fns";

/**
 * Agenda dates are stored as UTC-midnight "calendar dates" with no meaningful
 * time-of-day. Formatting them with the local timezone can shift the day
 * backwards for timezones behind UTC (e.g. Brazil). This re-anchors the date
 * to local midnight using its UTC components before formatting, so the
 * calendar date shown always matches the one that was saved.
 */
export function formatCalendarDate(
  date: Date,
  pattern: string,
  options?: { locale?: Locale },
) {
  const aligned = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return format(aligned, pattern, options);
}
