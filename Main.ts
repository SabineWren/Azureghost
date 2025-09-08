import { FormatWindow } from "./Format.math.ts"
import { CompareWindows, ComputeRespawn } from "./math.ts"
import { BOSS_VANILLA, Boss, Kill, MONTH } from "./types.ts"
import { Array, pipe } from "effect"

const input: Kill[] = [
	{
		Boss: BOSS_VANILLA.Azuregos,
		At: Temporal.PlainDateTime.from({ year: 2025, month: MONTH.Jan, day: 1, hour: 14, minute: 5 }),
	},
]

const output = pipe(
	input,
	xs => xs.map(ComputeRespawn),
	xs => xs.sort(CompareWindows),
	xs => xs.map(FormatWindow),
	Array.prepend("**__UPCOMING BOSS TIMERS__**"),
	xs => xs.join("\n\n"),
)

const payload = {
	"username": "Boss Timers",
	"content": output,
}
console.log(JSON.stringify(payload))
