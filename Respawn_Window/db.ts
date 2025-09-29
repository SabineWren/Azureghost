import { Array, CopyWith, DateTime, Dict, Flow, Month, Option, Record, S, Pipe } from "../Lib/pure.ts"
import { BOSS, type BossName, BossNames, BossKill } from "./types.ts"
import { GuildId } from "../Discord/types.ts"

const guildState = S.Struct({
	TimeZone: S.String,// TODO validate timezones
	DeathTime: S.Map({ key: S.String, value: S.ZonedDateTime })
})
type guildState = typeof guildState.Type
const defaultGuild: guildState = {
	TimeZone: "UTC",
	DeathTime: new Map(),
}
const state = new Map<GuildId, guildState>()

// TODO persist
const getGuild = (gId: GuildId): Promise<guildState> => {
	const s = state.get(gId)
	return Promise.resolve (s ? s : defaultGuild)
}

export const GetKills = (gId: GuildId): Promise<BossKill[]> =>
	getGuild(gId).then(s => Pipe(
		Record.Entries(BOSS),
		Array.FilterMap(
			([k, v]) => s.DeathTime.has(k),
			([k, v]): BossKill => ({ Boss: v, At: s.DeathTime.get(k)! }),
		),
))

export const TimeRemove = async (gId: GuildId, name: BossName): Promise<void> => {
	const s = await getGuild(gId)
	Pipe(
		Dict.Remove(s.DeathTime, name),
		x => CopyWith(s, { DeathTime: x }),
		x => state.set(gId, x),
	)
}

export const TimeSave = async (gId: GuildId, name: BossName, t: Temporal.ZonedDateTime): Promise<void> => {
	const s = await getGuild(gId)
	Pipe(
		Dict.Set(s.DeathTime, name, t),
		x => CopyWith(s, { DeathTime: x }),
		x => state.set(gId, x),
	)
}

export const TimeZoneGet = (gId: GuildId): Promise<string> =>
	getGuild(gId).then(x => x.TimeZone)

export const TimeZoneSet = async (gId: GuildId, tz: string): Promise<void> => {
	const s = await getGuild(gId)
	state.set(gId, CopyWith(s, { TimeZone: tz }))
}
