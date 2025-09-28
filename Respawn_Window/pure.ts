import { Array, DateTime, Dict, Flow, HookR, Option, Record, Pipe } from "../Lib/pure.ts"
import { Boss, Kill, type Window } from "./types.ts"

const formatWindow = (tz: string) => (x: Window): string => {
	const s = x.Start.withTimeZone(tz)
	const e = x.End.withTimeZone(tz)
	return [
		x.Boss.Emoji + "  " + x.Boss.Name,
		`${DateTime.Format(s)} to ${DateTime.Format(e)} **-** *Server / ${tz}*`,
		`${DateTime.ToUnix(s)} to ${DateTime.ToUnix(e)} **-** *Local*`,
	].join("\n")
}

export const ComputeRespawnWindow = (k: Kill): Window => HookR(
	k.At.add(k.Boss.Respawn.Delay),
	ws => ws.add(k.Boss.Respawn.Length),
	(ws, we) => ({ Boss: k.Boss, Start: ws, End: we }),
)

export const ComputeRespawnWindows = (tz: string, xs: readonly Kill[]): string => Pipe(
	xs,
	Array.map(ComputeRespawnWindow),
	Array.SortBy(x => x.Start, Temporal.ZonedDateTime.compare),
	Array.map(formatWindow(tz)),
	Array.prepend("**UPCOMING BOSS TIMERS**"),
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
