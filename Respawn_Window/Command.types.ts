
import type {} from "discord-api-types/v10"
import { BOSS } from "./types.ts"
import { Array, DateTime, Month, Pipe, Record } from "../Lib/pure.ts"
import {
	ApplicationCommandOption,
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

export const KillTimeOption = [
	ApplicationCommandOption.Integer.make({
		name: "year" satisfies Temporal.DateTimeUnit,
		description: "+ve for year of death, -ve for delta, or empty for 'now'.",
		required: false,
		min_value: 2025,
		max_value: 2100,
	}),
	ApplicationCommandOption.Integer.make({
		name: "month" satisfies Temporal.DateTimeUnit,
		description: "+ve for month of death, -ve for delta, or empty for 'now'.",
		required: false,
		choices: Pipe(
			Record.Entries(Month),
			Array.map(([name, value]) => ({ name, value })),
		),
	}),
	ApplicationCommandOption.Integer.make({
		name: "day" satisfies Temporal.DateTimeUnit,
		description: "+ve for day of death, -ve for delta, or empty for 'now'.",
		required: false,
		min_value: -31,
		max_value: 31,
	}),
	ApplicationCommandOption.Integer.make({
		name: "hour" satisfies Temporal.DateTimeUnit,
		description: "+ve for hour of death, -ve for delta, or empty for 'now'.",
		required: false,
		min_value: -59,
		max_value: 59,
	}),
	ApplicationCommandOption.Integer.make({
		name: "minute" satisfies Temporal.DateTimeUnit,
		description: "+ve for minute of death, -ve for delta, or empty for 'now'.",
		required: false,
		min_value: -59,
		max_value: 59,
	}),
] as const

const _KILL = {
	name: "kill",
	description: "Update kill time for a boss",
	// TODO remove cast
	options: [optionBoss, ...KillTimeOption] satisfies ApplicationCommandOption.Union[] as any,
	type: ApplicationCommandType.ChatInput,
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild],
} as const satisfies NewCommand

export const COMMANDS: NewCommand[] = [_KILL]
