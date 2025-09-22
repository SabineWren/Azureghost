import { describe, it } from "node:test"
import { AlterDateTime } from "./pure.ts"

// Node assertions don't work on Temporal, so convert to string.
const equal = await (() => import("expect").then(({ expect }) =>
	(a: Temporal.ZonedDateTime, b: Temporal.ZonedDateTime) =>
		expect(a.toString()).toEqual(b.toString())
	))()

await describe("AlterDateTime", async () => {
	const a = Temporal.ZonedDateTime.from({
		timeZone: "UTC",
		year: 2000,
		month: 6,
		day: 15,
		hour: 20,
		minute: 30,
	})

	await it("AlterDateTime No-op", () => {
		const e = a
		const b = AlterDateTime(a, [])
		equal(e, b)
	})

	await it("AlterDateTime Set", () => {
		const e = a.with({ year: 2025 })
		const b = AlterDateTime(a, [["year", 2025]])
		equal(e, b)
	})

	await it("AlterDateTime Subtract", () => {
		const e = a.with({ year: 1999 })
		const b = AlterDateTime(a, [["year", -1]])
		equal(e, b)
	})

	await it("AlterDateTime Compound", () => {
		const e = a.with({ year: 1999, hour: 19, minute: 20 })
		const b = AlterDateTime(a, [
			["year", -1],
			["hour", -1],
			["minute", 20],
		])
		equal(e, b)
	})
})
