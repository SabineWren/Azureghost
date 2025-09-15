import { Array, DateTime, Flow, S } from "../Lib/math.ts"
import { Boss, Kill, type Window } from "./types.ts"

const formatWindow = (x: Window): string =>
	x.Boss.Name + " " + x.Boss.Emoji
	// TODO: Server time changes with UK DST.
	+ "\n" + `${DateTime.Format(x.Start)} to ${DateTime.Format(x.End)} **-** *Server Time*`
	+ "\n" + `${DateTime.ToUnix(x.Start)} to ${DateTime.ToUnix(x.End)} **-** *Local Time*`

export const ComputeRespawnWindow = (k: Kill): Window => S(
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
