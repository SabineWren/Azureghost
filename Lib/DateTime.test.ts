import { describe, it } from "node:test"
import * as DateTime from "./DateTime.pure.ts"

// Node assertions don't work on Temporal, so convert to string.
const equal = await (() => import("expect").then(({ expect }) =>
	(a: Temporal.ZonedDateTime, b: Temporal.ZonedDateTime) =>
		expect(a.toString()).toEqual(b.toString())
	))()

await describe("DateTime.ZonedDateTimeWith", async () => {
	const a = Temporal.ZonedDateTime.from({
		timeZone: "UTC",
		year: 2000,
		month: 6,
		day: 15,
		hour: 20,
		minute: 30,
	})

	await it("DateTime.ZonedDateTimeWith No-op", () => {
		const e = a
		const b = DateTime.ZonedDateTimeWith(a, [])
		equal(e, b)
	})

	await it("DateTime.ZonedDateTimeWith Set", () => {
		const e = a.with({ year: 2025 })
		const b = DateTime.ZonedDateTimeWith(a, [["year", 2025]])
		equal(e, b)
	})

	await it("DateTime.ZonedDateTimeWith Subtract", () => {
		const e = a.with({ year: 1999 })
		const b = DateTime.ZonedDateTimeWith(a, [["year", -1]])
		equal(e, b)
	})

	await it("DateTime.ZonedDateTimeWith Compound", () => {
		const e = a.with({ year: 1999, hour: 19, minute: 20 })
		const b = DateTime.ZonedDateTimeWith(a, [
			["year", -1],
			["hour", -1],
			["minute", 20],
		])
		equal(e, b)
	})
})
