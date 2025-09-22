
import type {
	APIApplicationCommandIntegerOption,
	APIApplicationCommandOption,
} from "discord-api-types/v10"
import { BOSS } from "./types.ts"
import { Array, DateTime, Month, Pipe, Record } from "../Lib/pure.ts"
import {
	ApplicationCommandOption,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type NewCommand,
} from "../Discord/types.ts"

const optionBoss = ApplicationCommandOption.String.make({
	name: "boss",
	description: "Which boss died?",
	required: true,
	choices: Pipe(
		Record.Keys(BOSS),
		Array.map(x => ({ name: x, value: x })),
	),
})

export const KillTimeOption = {
	"year": ApplicationCommandOption.Integer.make({
		name: "year",
		description: "+ve for year of death, -ve for delta, or empty for 'now'.",
		required: false,
		min_value: 2025,
		max_value: 2100,
	}),
	"month": ApplicationCommandOption.Integer.make({
		name: "month",
		description: "+ve for month of death, -ve for delta, or empty for 'now'.",
		required: false,
		choices: Pipe(
			Record.Entries(Month),
			Array.map(([name, value]) => ({ name, value })),
		),
	}),
	"day": ApplicationCommandOption.Integer.make({
		name: "day",
		description: "+ve for day of death, -ve for delta, or empty for 'now'.",
		required: false,
		min_value: -31,
		max_value: 31,
	}),
	"hour": ApplicationCommandOption.Integer.make({
		name: "hour",
		description: "+ve for hour of death, -ve for delta, or empty for 'now'.",
		required: false,
		min_value: -59,
		max_value: 59,
	}),
	"minute": ApplicationCommandOption.Integer.make({
		name: "minute",
		description: "+ve for minute of death, -ve for delta, or empty for 'now'.",
		required: false,
		min_value: -59,
		max_value: 59,
	}),
} as const satisfies Partial<Record<Temporal.DateTimeUnit, ApplicationCommandOption.Integer>>

const _KILL = {
	name: "kill",
	description: "Update kill time for a boss",
	// TODO remove cast
	options: [optionBoss, ...Record.Values(KillTimeOption)] satisfies ApplicationCommandOption.Union[] as any,
	type: ApplicationCommandType.ChatInput,
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild],
} as const satisfies NewCommand

export const COMMANDS: NewCommand[] = [_KILL]
