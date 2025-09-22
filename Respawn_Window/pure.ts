import { Array, DateTime, Dict, Flow, HookR, Option, Record, Pipe } from "../Lib/pure.ts"
import { Boss, Kill, type Window } from "./types.ts"
import { Tuple } from "effect"

export const AlterDateTime = (
	d: Temporal.ZonedDateTime,
	changes: readonly (readonly [Temporal.DateTimeUnit, number])[],
): Temporal.ZonedDateTime => {
	const [positives, negatives] = Pipe(
		Array.Partition(changes, ([k, v]) => v >= 0),
		Tuple.mapSecond(Array.map(([k, v]) => [
			(k + "s") as keyof Temporal.DurationLike,
			v * -1,
		] as const)),
	)
	return Pipe(
		d,
		x => Array.isEmptyArray(positives) ? x : x.with(Record.FromEntries(positives)),
		x => Array.isEmptyArray(negatives) ? x : x.subtract(Record.FromEntries(negatives)),
	)
}

const formatWindow = (x: Window): string =>
	x.Boss.Emoji + "  " + x.Boss.Name
	// TODO: Server time changes with UK DST.
	+ "\n" + `${DateTime.Format(x.Start)} to ${DateTime.Format(x.End)} **-** *Server Time*`
	+ "\n" + `${DateTime.ToUnix(x.Start)} to ${DateTime.ToUnix(x.End)} **-** *Local Time*`

export const ComputeRespawnWindow = (k: Kill): Window => HookR(
	k.At.add(k.Boss.Respawn.Delay),
	ws => ws.add(k.Boss.Respawn.Length),
	(ws, we) => ({ Boss: k.Boss, Start: ws, End: we }),
)

export const ComputeRespawnWindows: (xs: readonly Kill[]) => string = Flow(
	Array.map(ComputeRespawnWindow),
	Array.SortBy(x => x.Start, Temporal.PlainDateTime.compare),
	Array.map(formatWindow),
	Array.prepend("**__UPCOMING BOSS TIMERS__**"),
	Array.join("\n\n"),
)

/**
 * Turtle has server configuration code to scale respawn time.
  * Afaik, this has never been enabled in production.
 * @param currentPop `/who` or `s info` at time of death
 */
const popScaling = (currentPop: number) =>
	_BLIZZLIKE_POPULATION / Math.max(currentPop, _BLIZZLIKE_POPULATION)

const _BLIZZLIKE_POPULATION = 2500
