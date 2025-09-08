import { pipe } from "effect"
import type { Window } from "./types.ts"

export const ToDate = (d: Temporal.PlainDateTime): Date =>
	new Date(d.toString())

export const FormatWindow = (x: Window): string =>
	x.Boss.Name + " " + x.Boss.Emoji
	+ "\n" + `${FormatServer(x.Start)} to ${FormatServer(x.End)} **-** *Server Time*`
	+ "\n" + `${FormatUnix(x.Start)} to ${FormatUnix(x.End)} **-** *Local Time*`

export const FormatUnix = (d: Temporal.PlainDateTime): string => pipe(
	ToDate(d),
	d => d.getTime(),
	d => Math.floor(d / 1000),
	d => `<t:${d}:f>`,
)

// Server time changes with UK DST.
// TODO use Temporal time zones.
// old way: d.setHours(d.getHours() - 1)
export const FormatServer = (d: Temporal.PlainDateTime): string =>
	ToDate(d).toLocaleString(`en-AU`, _DATE_OPTIONS)

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
