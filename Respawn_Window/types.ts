import { Record, S } from "../Lib/pure.ts"

const Respawn = S.Struct({
	Delay: S.Duration,
	Length: S.Duration,
})

export const Boss = S.Struct({
	Name: S.String,
	Emoji: S.String,
	Respawn: Respawn,
})

export const BossKill = S.Struct({
	Boss: Boss,
	At: S.ZonedDateTime,
})

export type Respawn = typeof Respawn.Type
export type Boss = typeof Boss.Type
export type BossKill = typeof BossKill.Type

export type Window = {
	Boss: Boss
	Start: Temporal.ZonedDateTime
	End: Temporal.ZonedDateTime
}

export const BOSS = {
	// ------------------------------
	// ************ Vanilla ************
	// ------------------------------
	Azuregos: {
		Name: "Azuregos",
		Emoji: ":dragon_face:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 3 }),
			Length: Temporal.Duration.from({ days: 4 }),
		},
	},
	DoN: {
		Name: "Dragons of Nightmare",
		Emoji: ":dragon:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 4 }),
			Length: Temporal.Duration.from({ days: 3 }),
		},
	},
	Kazzak: {
		Name: "Lord Kazzak",
		Emoji: ":smiling_imp:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 3 }),
			Length: Temporal.Duration.from({ days: 4 }),
		},
	},
	// ------------------------------
	// ************ Turtle ************
	// ------------------------------
	Reaver: {
		Name: "Dark Reaver of Karazhan",
		Emoji: ":horse_racing:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 2 }),
			Length: Temporal.Duration.from({ days: 3 }),
		},
	},
	Moo: {
		Name: "Moo",
		Emoji: ":cow:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 4 }),
			Length: Temporal.Duration.from({ days: 7 }),
		},
	},
	Overseer: {
		Name: "Nerubian Overseer",
		Emoji: ":spider:",
		Respawn: {
			Delay: Temporal.Duration.from({ days: 5 }),
			Length: Temporal.Duration.from({ days: 2 }),
		},
	},
} as const satisfies Record<string, Boss>
export type BossName = keyof typeof BOSS

export const BossNames = Record.Keys(BOSS)
