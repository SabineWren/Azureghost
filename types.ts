import { Schema as S } from "effect"

const Duration = S.declare((x: any): x is Temporal.Duration => typeof x === "object")
const PlainDateTime = S.declare((x: any): x is Temporal.PlainDateTime => typeof x === "object")

const Respawn = S.Struct({
	Delay: Duration,
	Length: Duration,
})

export const Boss = S.Struct({
	Name: S.String,
	Emoji: S.String,
	Respawn: Respawn,
})

export const Kill = S.Struct({
	Boss: Boss,
	At: PlainDateTime,
})

export type Respawn = typeof Respawn.Type
export type Boss = typeof Boss.Type
export type Kill = typeof Kill.Type

export type Window = {
	Boss: Boss
	Start: Temporal.PlainDateTime
	End: Temporal.PlainDateTime
}

export const MONTH = { Jan: 1, Feb: 2, March: 3, Apr: 4, May: 5, June: 6, July: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }

export const BOSS_VANILLA = {
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

} as const satisfies Record<string, Boss>

export const BOSSES_TURTLE = {
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
