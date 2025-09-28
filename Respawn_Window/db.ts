import { Array, CopyWith, DateTime, Dict, Flow, Month, Option, Record, S, Pipe } from "../Lib/pure.ts"
import { BOSS, type BossName, BossNames, Kill } from "./types.ts"
import { GuildId } from "../Discord/types.ts"

const guildState = S.Struct({
	TimeZone: S.String,// TODO store server timezone "UTC", "Europe/London"
	Enabled: S.Set(S.String),
	DeathTime: S.Map({ key: S.String, value: S.ZonedDateTime })
})
type guildState = typeof guildState.Type
const defaultGuild: guildState = {
	TimeZone: "UTC",
	Enabled: new Set(BossNames),
	DeathTime: new Map(),
}
const state = new Map<GuildId, guildState>()

// TODO persist
const getGuild = (gId: GuildId): Promise<guildState> => {
	const s = state.get(gId)
	return Promise.resolve (s ? s : defaultGuild)
}

export const GetKills = (gId: GuildId): Promise<Kill[]> =>
	getGuild(gId).then(s => Pipe(
		Record.Entries(BOSS),
		Array.FilterMap(
			([k, v]) => s.Enabled.has(k) && s.DeathTime.has(k),
			([k, v]): Kill => ({ Boss: v, At: s.DeathTime.get(k)! }),
		),
))

export const SaveTime = async (gId: GuildId, name: BossName, t: Temporal.ZonedDateTime): Promise<void> => {
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

export const ToggleEnabled = async (gId: GuildId, name: BossName, b: boolean): Promise<void> => {
	const s = await getGuild(gId)

	// TODO add set Lib
	const setCopy = new Set(s.Enabled)
	if (b) setCopy.add(name)
	else setCopy.delete(name)

	state.set(gId, CopyWith(s, { Enabled: setCopy }))
}
