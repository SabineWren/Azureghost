import FsSync, { promises as Fs } from "node:fs"

import { Array, CopyWith, DateTime, Dict, Flow, Month, Option, Record, S, Set, Pipe } from "../Lib/pure.ts"
import { AppState, type BossName, GuildState } from "./types.ts"
import { GuildId, Snowflake } from "../Discord/types.ts"

const dbFilePath = "db.json"
const defaultGuild = GuildState.make({})
const defaultAppState: AppState = new Map<GuildId, GuildState>()

export const AppGet = (): Promise<AppState> => FsSync.existsSync(dbFilePath)
	? Fs.readFile(dbFilePath, "utf8").then(S.DecodeThrows(AppState))
	: Promise.resolve(defaultAppState)

void AppGet()// Force deserialization on startup in case of error

const appSave = (s: AppState): Promise<void> => Pipe(
	S.Encode(AppState)(s),
	e => Fs.writeFile(dbFilePath, e)
)

export const GuildGet = (gId: GuildId): Promise<GuildState> =>
	AppGet().then(Dict.GetOr(gId, defaultGuild))

const guildSave = async (gId: GuildId, s: Partial<GuildState>): Promise<void> => {
	const app = await AppGet()
	const guild = Pipe(
		Dict.GetOr(app, gId, defaultGuild),
		x => CopyWith(x, s),
	)
	void app.set(gId, guild)
	return appSave(app)
}

export const Modify = (gId: GuildId, alter: (s: GuildState) => Partial<GuildState>): Promise<void> =>
	GuildGet(gId).then(s => guildSave(gId, alter(s)))

export const NotifySet = async (gId: GuildId, name: BossName): Promise<void> => {
	const s = await GuildGet(gId)
	await Pipe(
		CopyWith(s, {
			Announced: Set.Add(s.Announced, name),
		}),
		x => guildSave(gId, x),
	)
}

export const TimeRemove = async (gId: GuildId, name: BossName): Promise<void> => {
	const s = await GuildGet(gId)
	await Pipe(
		CopyWith(s, {
			Announced: Set.Remove(s.Announced, name),
			DeathTime: Dict.Remove(s.DeathTime, name),
		}),
		x => guildSave(gId, x),
	)
}

export const TimeSave = async (gId: GuildId, channelId: Option<Snowflake>, name: BossName, t: Temporal.ZonedDateTime): Promise<void> => {
	const s = await GuildGet(gId)
	await Pipe(
		CopyWith(s, {
			Announced: Set.Remove(s.Announced, name),
			ChannelAnnounce: channelId,
			DeathTime: Dict.Set(s.DeathTime, name, t),
		}),
		x => guildSave(gId, x),
	)
}

export const TimeZoneGet = (gId: GuildId): Promise<string> =>
	GuildGet(gId).then(x => x.TimeZone)

export const TimeZoneSet = async (gId: GuildId, tz: string): Promise<void> => {
	const s = await GuildGet(gId)
	await Pipe(
		CopyWith(s, { TimeZone: tz }),
		x => guildSave(gId, x),
	)
}
