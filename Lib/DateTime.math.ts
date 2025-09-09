import { pipe } from "effect"

export const ToUnix = (d: Temporal.PlainDateTime): string => pipe(
	toDate(d),
	d => d.getTime(),
	d => Math.floor(d / 1000),
	d => `<t:${d}:f>`,
)

// TODO customize time zones with Temporal.
// old way 1: d.setHours(d.getHours() - 1)
// old way 2: Intl.DateTimeFormatOptions
export const Format = (d: Temporal.PlainDateTime, locale?: Intl.UnicodeBCP47LocaleIdentifier, options?: Intl.DateTimeFormatOptions): string => {
	const opt = options ? { ..._DATE_OPTIONS, ...options } : _DATE_OPTIONS
	// en-AU because it avoids the confusion of numeric mm/dd/yy formats.
	return toDate(d).toLocaleString(locale ?? "en-AU", opt)
}

const _DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	timeZone: "UTC",//"Europe/London",
	month: "short",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	year: "numeric",
	// V8 defaults to 24:00 instead of 00:00
	// https://issues.chromium.org/issues/40116189
	// hour12: false,
	hourCycle: "h23",
}

const toDate = (d: Temporal.PlainDateTime): Date =>
	new Date(d.toString())
