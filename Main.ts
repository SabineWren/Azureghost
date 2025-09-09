import { Array, DateTime } from "./Lib/math.ts"
import { ComputeRespawnWindow } from "./math.ts"
import { Boss, BOSS_VANILLA, Kill, MONTH, type Window } from "./types.ts"
import { pipe } from "effect"

const input: Kill[] = [
	{
		Boss: BOSS_VANILLA.Azuregos,
		At: Temporal.PlainDateTime.from({ year: 2025, month: MONTH.Jan, day: 1, hour: 14, minute: 5 }),
	},
]

const formatWindow = (x: Window): string =>
	x.Boss.Name + " " + x.Boss.Emoji
	// TODO: Server time changes with UK DST.
	+ "\n" + `${DateTime.Format(x.Start)} to ${DateTime.Format(x.End)} **-** *Server Time*`
	+ "\n" + `${DateTime.ToUnix(x.Start)} to ${DateTime.ToUnix(x.End)} **-** *Local Time*`

const output = pipe(
	input,
	Array.map(ComputeRespawnWindow),
	Array.SortBy(x => x.Start, Temporal.PlainDateTime.compare),
	Array.map(formatWindow),
	Array.prepend("**__UPCOMING BOSS TIMERS__**"),
	Array.join("\n\n"),
)

const payload = {
	"username": "Boss Timers",
	"content": output,
}
console.log(JSON.stringify(payload))
