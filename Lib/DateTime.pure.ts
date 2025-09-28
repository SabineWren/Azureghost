import { Tuple } from "effect"
import * as Array from "./Array.pure.ts"
import { Pipe } from "./Function.pure.ts"
import * as Option from "./Option.pure.ts"
import * as Record from "./Record.pure.ts"

export const ToUnix = (d: Temporal.ZonedDateTime): string => Pipe(
	d.epochMilliseconds,
	d => Math.floor(d / 1000),
	d => `<t:${d}:f>`,
)

export const Format = (d: Temporal.ZonedDateTime, locale?: Intl.UnicodeBCP47LocaleIdentifier, options?: Intl.DateTimeFormatOptions): string => {
	const opt = options ? { ..._DATE_OPTIONS, ...options } : _DATE_OPTIONS
	opt.timeZone = d.timeZoneId
	// en-AU because it avoids the confusion of numeric mm/dd/yy formats.
	return new Date(d.epochMilliseconds).toLocaleString(locale ?? "en-AU", opt)
}

const _DATE_OPTIONS: Intl.DateTimeFormatOptions = {
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

export const KeyOfPlainDateTimeLike = [
	"year", "month", "day", "hour", "minute", "second", "millisecond", "nanosecond",
] as const satisfies (keyof Temporal.PlainDateTimeLike)[]
export type KeyOfPlainDateTimeLike = typeof KeyOfPlainDateTimeLike[number]

export const KeyOfDurationLike = [
	"years", "months", "days", "hours", "minutes", "seconds", "milliseconds", "nanoseconds",
] as const satisfies (keyof Temporal.DurationLike)[]
export type KeyOfDurationLike = typeof KeyOfDurationLike[number]

const keyTimeToDuration: { [k in KeyOfPlainDateTimeLike]: KeyOfDurationLike} = {
	"year": "years",
	"month": "months",
	"day": "days",
	"hour": "hours",
	"minute": "minutes",
	"second": "seconds",
	"millisecond": "milliseconds",
	"nanosecond": "nanoseconds",
}

export const ZonedDateTimeWith = (
	d: Temporal.ZonedDateTime,
	xs: Iterable<readonly [string, number]>,
): Temporal.ZonedDateTime => Pipe(
	xs,
	Array.Choose(([n, v]) => Pipe(
		Array.findFirst(KeyOfPlainDateTimeLike, y => y === n),
		Option.map(name => [name, v] as const),
	)),
	Array.Partition(([k, v]) => v >= 0),
	Tuple.mapSecond(Array.map(([k, v]) => [keyTimeToDuration[k], v * -1] as const)),
	([positives, negatives]) => Pipe(
		d,
		d => Array.isEmptyArray(positives) ? d : d.with(Record.FromEntries(positives)),
		d => Array.isEmptyArray(negatives) ? d : d.subtract(Record.FromEntries(negatives)),
	),
)
