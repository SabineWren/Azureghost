import FsSync, { promises as Fs } from "node:fs"

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

const appState = S.MutableMap({ key: GuildId, value: guildState })
type appState = typeof appState.Type
const defaultAppState: appState = new Map<GuildId, guildState>()

const dbFilePath = "db.json"

const appGet = (): Promise<appState> => FsSync.existsSync(dbFilePath)
	? Fs.readFile(dbFilePath, "utf8").then(S.DecodeThrows(appState))
	: Promise.resolve(defaultAppState)

const appSave = (s: appState): Promise<void> => Pipe(
	S.Encode(appState)(s),
	e => Fs.writeFile(dbFilePath, e)
)

const guildGet = (gId: GuildId): Promise<guildState> =>
	appGet().then(Dict.GetOr(gId, defaultGuild))

const guildSave = async (gId: GuildId, s: Partial<guildState>): Promise<void> => {
	const app = await appGet()
	const guild = Pipe(
		Dict.GetOr(app, gId, defaultGuild),
		x => CopyWith(x, s),
	)
	void app.set(gId, guild)
	return appSave(app)
}

export const GetKills = (gId: GuildId): Promise<BossKill[]> =>
	guildGet(gId).then(s => Pipe(
		Record.Entries(BOSS),
		Array.FilterMap(
			([k, v]) => s.DeathTime.has(k),
			([k, v]): BossKill => ({ Boss: v, At: s.DeathTime.get(k)! }),
		),
))

export const TimeRemove = async (gId: GuildId, name: BossName): Promise<void> => {
	const s = await guildGet(gId)
	await Pipe(
		Dict.Remove(s.DeathTime, name),
		x => CopyWith(s, { DeathTime: x }),
		x => guildSave(gId, x),
	)
}

export const TimeSave = async (gId: GuildId, name: BossName, t: Temporal.ZonedDateTime): Promise<void> => {
	const s = await guildGet(gId)
	await Pipe(
		Dict.Set(s.DeathTime, name, t),
		x => CopyWith(s, { DeathTime: x }),
		x => guildSave(gId, x),
	)
}

export const TimeZoneGet = (gId: GuildId): Promise<string> =>
	guildGet(gId).then(x => x.TimeZone)

export const TimeZoneSet = async (gId: GuildId, tz: string): Promise<void> => {
	const s = await guildGet(gId)
	await Pipe(
		CopyWith(s, { TimeZone: tz }),
		x => guildSave(gId, x),
	)
}
