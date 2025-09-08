import { Boss, Kill, type Window } from "./types.ts"
import { ToDate } from "./Format.math.ts"
import { Ψ, S, Sub } from "./Lib.math.ts"

export const CompareWindows =
	Ψ((x: Window) => ToDate(x.Start).getTime(), Sub)

export const ComputeRespawn = (k: Kill): Window => S(
	k.At.add(k.Boss.Respawn.Delay),
	ws => ws.add(k.Boss.Respawn.Length),
	(ws, we) => ({ Boss: k.Boss, Start: ws, End: we }),
)

/**
 * Turtle has server configuration code to scale respawn time.
  * Afaik, this has never been enabled in production.
 * @param currentPop `/who` or `s info` at time of death
 */
const popScaling = (currentPop: number) =>
	_BLIZZLIKE_POPULATION / Math.max(currentPop, _BLIZZLIKE_POPULATION)

const _BLIZZLIKE_POPULATION = 2500
