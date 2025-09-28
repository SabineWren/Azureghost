import { Array, CopyWith, DateTime, Dict, Flow, Month, Option, Record, Pipe } from "../Lib/pure.ts"
import { BOSS, type BossName, Kill } from "./types.ts"
import { GuildId } from "../Discord/types.ts"

// TODO store server timezone "UTC", "Europe/London"

const tInitial = Temporal.ZonedDateTime.from({ timeZone: "UTC", year: 2025, month: Month.Jan, day: 1, hour: 14, minute: 5 })
const sInitial: Map<BossName, Kill> = Pipe(
	BOSS,
	Record.MapValues((v, k): Kill => ({ Boss: v, At: tInitial })),
	Record.Entries,
	xs => new Map(xs),
)

let state = new Map<GuildId, Map<BossName, Kill>>()

export const GetKills = (gId: GuildId): Promise<Map<BossName, Kill>> => Pipe(
	Dict.Get(state, gId),
	x => Promise.resolve(x),// TODO persist
	x => x.then(Option.getOrElse(() => sInitial)),
)

const updateKill = (gId: GuildId, name: BossName, k: Kill): Promise<void> =>
	GetKills(gId).then(Flow(
		Dict.Set(name, k),
		next => void state.set(gId, next),
		x => Promise.resolve(x),// TODO persist
	))

export const SaveTime = (gId: GuildId, name: BossName, t: Temporal.ZonedDateTime): Promise<void> =>
	GetKills(gId).then(Flow(
		Dict.Get(name),
		Option.match({
			onNone: () => {
				console.error("Save time for invalid boss", name)
				return Promise.resolve(void 0)
			},
			onSome: x => updateKill(gId, name, CopyWith(x, { At: t }))
		}),
	))
