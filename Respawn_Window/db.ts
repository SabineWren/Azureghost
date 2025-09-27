import { Array, CopyWith, DateTime, Dict, Flow, Month, Option, Record, Pipe } from "../Lib/pure.ts"
import { BOSS, Kill } from "./types.ts"
import { GuildId } from "../Discord/types.ts"

// TODO store server timezone "UTC", "Europe/London"

type bossName = keyof typeof BOSS

const tInitial = Temporal.ZonedDateTime.from({ year: 2025, month: Month.Jan, day: 1, hour: 14, minute: 5 })
const sInitial: Map<bossName, Kill> = Pipe(
	BOSS,
	Record.MapValues((v, k): Kill => ({ Boss: v, At: tInitial })),
	Record.Entries,
	xs => new Map(xs),
)

let state = new Map<GuildId, Map<bossName, Kill>>()

export const GetKills = (gId: GuildId): Promise<Map<bossName, Kill>> => Pipe(
	Dict.Get(state, gId),
	x => Promise.resolve(x),// TODO persist
	x => x.then(Option.getOrElse(() => sInitial)),
)

export const UpdateKill = (gId: GuildId, name: bossName, k: Kill): Promise<void> =>
	GetKills(gId).then(Flow(
		Dict.Set(name, k),
		next => void state.set(gId, next),
		x => Promise.resolve(x),// TODO persist
	))

export const UpdateTime = (gId: GuildId, name: bossName, t: Temporal.ZonedDateTime): Promise<void> =>
	GetKills(gId).then(Flow(
		Dict.Get(name),
		Option.match({
			onNone: () => {
				console.error("Save time for invalid boss", name)
				return Promise.resolve(void 0)
			},
			onSome: x => UpdateKill(gId, name, CopyWith(x, { At: t }))
		}),
	))
