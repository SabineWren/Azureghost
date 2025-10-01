
import { BossNames } from "./types.ts"
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
	description: "Which world boss?",
	required: true,
	choices: Array.map(BossNames, x => ({ name: x, value: x })),
})

const optionTimeZone = ApplicationCommandOption.String.make({
	name: "timezone",
	description: "Server time zone. Necessary for data entry and output formatting.",
	required: true,
})

const optionDescription = ApplicationCommandOption.String.make({
	name: "description",
	description: "Descriptive text below boss name.",
	required: false,
})

const optionEmoji = ApplicationCommandOption.String.make({
	name: "emoji",
	description: "String prefix for boss name.",
	required: false,
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

export const COMMANDS: NewCommand[] = [
	{
		name: "clear",
		description: "Remove a boss kill time",
		options: [optionBoss] satisfies ApplicationCommandOption.Union[],
		type: ApplicationCommandType.ChatInput,
		integration_types: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
	},
	{
		name: "description",
		description: "Add description text to a boss. Empty value to reset.",
		options: [optionBoss, optionDescription] satisfies ApplicationCommandOption.Union[],
		type: ApplicationCommandType.ChatInput,
		integration_types: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
	},
	{
		name: "emoji",
		description: "Change emoji for a boss. Empty value to reset.",
		options: [optionBoss, optionEmoji] satisfies ApplicationCommandOption.Union[],
		type: ApplicationCommandType.ChatInput,
		integration_types: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
	},
	{
		name: "kill",
		description: "Update kill time for a boss",
		// TODO remove cast
		options: [optionBoss, ...KillTimeOption] satisfies ApplicationCommandOption.Union[] as any,
		type: ApplicationCommandType.ChatInput,
		integration_types: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
	},
	{
		name: "timezone",
		description: "Update server time zone",
		options: [optionTimeZone],
		type: ApplicationCommandType.ChatInput,
		integration_types: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
	},
]
