import { GuildId, Snowflake } from "../Discord/types.ts"
import { Dict, Option, Pipe, S } from "../Lib/pure.ts"

export const BossNames = ["Azuregos", "DoN", "Kazzak", "Reaver", "Moo", "Overseer"] as const
export type BossName = typeof BossNames[number]

const Respawn = S.Struct({
	Delay: S.Duration,
	Length: S.Duration,
})

export const GuildState = S.Struct({
	Announced: Pipe(S.Literal(...BossNames), S.Set, S.Default(new Set())),
	ChannelAnnounce: Pipe(Snowflake, S.Option, S.Default(Option.none())),
	CustomEmoji: Pipe(
		S.Map({ key: S.Literal(...BossNames), value: S.String }),
		S.Default(new Map()),
	),
	DeathTime: Pipe(
		S.Map({ key: S.Literal(...BossNames), value: S.ZonedDateTime }),
		S.Default(new Map()),
	),
	Description: Pipe(
		S.Map({ key: S.Literal(...BossNames), value: S.String }),
		S.Default(new Map()),
	),
	// TODO validate timezones
	TimeZone: Pipe(S.String, S.Default("UTC")),
})

export const AppState = S.MutableMap({ key: GuildId, value: GuildState })

export type Respawn = typeof Respawn.Type
export type GuildState = typeof GuildState.Type
export type AppState = typeof AppState.Type

export type Range = {
	S: Temporal.ZonedDateTime
	E: Temporal.ZonedDateTime
}

export type Boss = {
	Name: string
	Emoji: string
	Respawn: Respawn
}

export const BOSS: ReadonlyMap<BossName, Boss> = new Map([
	// ------------------------------
	// ************ Vanilla ************
	// ------------------------------
	["Azuregos", {
		Name: "Azuregos",
		Emoji: ":dragon_face:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 3 }),
			Length: Temporal.Duration.from({ days: 4 }),
		},
	}],
	["DoN", {
		Name: "Dragons of Nightmare",
		Emoji: ":dragon:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 4 }),
			Length: Temporal.Duration.from({ days: 3 }),
		},
	}],
	["Kazzak", {
		Name: "Lord Kazzak",
		Emoji: ":smiling_imp:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 3 }),
			Length: Temporal.Duration.from({ days: 4 }),
		},
	}],
	// ------------------------------
	// ************ Turtle ************
	// ------------------------------
	["Reaver", {
		Name: "Dark Reaver of Karazhan",
		Emoji: ":horse_racing:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 2 }),
			Length: Temporal.Duration.from({ days: 3 }),
		},
	}],
	["Moo", {
		Name: "Moo",
		Emoji: ":cow:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 4 }),
			Length: Temporal.Duration.from({ days: 7 }),
		},
	}],
	["Overseer", {
		Name: "Nerubian Overseer",
		Emoji: ":spider:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 5 }),
			Length: Temporal.Duration.from({ days: 2 }),
		},
	}],
])
