import { Array, DateTime, Option, Pipe } from "./Lib/math.ts"
import { ComputeRespawnWindows } from "./Respawn_Window/math.ts"
import { BOSS_VANILLA, Kill, MONTH } from "./Respawn_Window/types.ts"
import { Config } from "env.ts"

const input: Kill[] = [
	{
		Boss: BOSS_VANILLA.Azuregos,
		At: Temporal.PlainDateTime.from({ year: 2025, month: MONTH.Jan, day: 1, hour: 14, minute: 5 }),
	},
]

const output = ComputeRespawnWindows(input)
const payload = {
	"username": "Boss Timers",
	"content": output,
}
// console.log(JSON.stringify(payload))
