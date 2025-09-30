import FsSync, { promises as Fs } from "node:fs"

import { Array, CopyWith, DateTime, Dict, Flow, Month, Option, Record, S, Set, Pipe } from "../Lib/pure.ts"
import { BOSS, type BossName, BossNames, BossKill } from "./types.ts"
import { GuildId, Snowflake } from "../Discord/types.ts"

const guildState = S.Struct({
	Announced: S.Set(S.String),
	ChannelAnnounce: S.Option(Snowflake),
	CustomEmoji: S.Map({ key: S.String, value: S.String }),
	DeathTime: S.Map({ key: S.String, value: S.ZonedDateTime }),
	TimeZone: S.String,// TODO validate timezones
})
type guildState = typeof guildState.Type
const defaultGuild: guildState = {
	Announced: Set.Empty(),
	ChannelAnnounce: Option.none(),
	CustomEmoji: new Map(),
	DeathTime: new Map(),
	TimeZone: "UTC",
}

const appState = S.MutableMap({ key: GuildId, value: guildState })
type appState = typeof appState.Type
const defaultAppState: appState = new Map<GuildId, guildState>()

const dbFilePath = "db.json"

export const AppGet = (): Promise<appState> => FsSync.existsSync(dbFilePath)
	? Fs.readFile(dbFilePath, "utf8").then(S.DecodeThrows(appState))
	: Promise.resolve(defaultAppState)

void AppGet()// Force deserialization on startup in case of error

const appSave = (s: appState): Promise<void> => Pipe(
	S.Encode(appState)(s),
	e => Fs.writeFile(dbFilePath, e)
)

const guildGet = (gId: GuildId): Promise<guildState> =>
	AppGet().then(Dict.GetOr(gId, defaultGuild))

const guildSave = async (gId: GuildId, s: Partial<guildState>): Promise<void> => {
	const app = await AppGet()
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
			([k, v]): BossKill => ({
				Boss: {
					...v,
					Emoji: Dict.GetOr(s.CustomEmoji, k, v.Emoji),
				},
				At: s.DeathTime.get(k)!,
			}),
		),
))

export const EmojiSet = async (gId: GuildId, name: BossName, emoji: Option<string>): Promise<void> => {
	const s = await guildGet(gId)
	await Pipe(
		CopyWith(s, {
			CustomEmoji: Option.match(emoji, {
				onNone: () => Dict.Remove(s.CustomEmoji, name),
				onSome: emoji => Dict.Set(s.CustomEmoji, name, emoji)
			}),
		}),
		x => guildSave(gId, x),
	)
}

export const NotifySet = async (gId: GuildId, name: BossName): Promise<void> => {
	const s = await guildGet(gId)
	await Pipe(
		CopyWith(s, {
			Announced: Set.Add(s.Announced, name),
		}),
		x => guildSave(gId, x),
	)
}

export const TimeRemove = async (gId: GuildId, name: BossName): Promise<void> => {
	const s = await guildGet(gId)
	await Pipe(
		CopyWith(s, {
			Announced: Set.Remove(s.Announced, name),
			DeathTime: Dict.Remove(s.DeathTime, name),
		}),
		x => guildSave(gId, x),
	)
}

export const TimeSave = async (gId: GuildId, channelId: Option<Snowflake>, name: BossName, t: Temporal.ZonedDateTime): Promise<void> => {
	const s = await guildGet(gId)
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
	guildGet(gId).then(x => x.TimeZone)

export const TimeZoneSet = async (gId: GuildId, tz: string): Promise<void> => {
	const s = await guildGet(gId)
	await Pipe(
		CopyWith(s, { TimeZone: tz }),
		x => guildSave(gId, x),
	)
}
