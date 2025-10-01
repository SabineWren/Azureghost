import { Array, DateTime, Dict, Flow, HookR, Option, Record, Pipe } from "../Lib/pure.ts"
import { BOSS, type GuildState, type Range, type Respawn } from "./types.ts"

const formatWindow = (tz: string, label: string, r: Range): string => {
	const s = r.S.withTimeZone(tz)
	const e = r.E.withTimeZone(tz)
	return [
		label,
		`${DateTime.Format(s)} to ${DateTime.Format(e)} **-** *Server / ${tz}*`,
		`${DateTime.ToUnix(s)} to ${DateTime.ToUnix(e)} **-** *Local*`,
	].join("\n")
}

export const ComputeRespawnWindow = (t: Temporal.ZonedDateTime, r: Respawn): Range => HookR(
	t.add(r.Delay),
	ws => ws.add(r.Length),
	(ws, we) => ({ S: ws, E: we }),
)

export const ComputeRespawnWindows = (tz: string, s: GuildState): string => Pipe(
	Dict.Entries(BOSS),
	Array.FilterMap(
		([k, v]) => s.DeathTime.has(k),
		([k, v]) => {
			const emoji = Dict.GetOr(s.CustomEmoji, k, v.Emoji)
			const description = Pipe(
				Dict.Get(s.Description, k),
				Option.map(x => "\n" + x),
				Option.getOrElse(() => ""),
			)
			return {
				Label: `${emoji} **${v.Name}**` + description,
				Window: ComputeRespawnWindow(s.DeathTime.get(k)!, v.Respawn),
			}
		},
	),
	Array.SortBy(x => x.Window.S, Temporal.ZonedDateTime.compare),
	Array.map(x => formatWindow(tz, x.Label, x.Window)),
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
