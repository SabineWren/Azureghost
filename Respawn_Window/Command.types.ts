
import type {
	APIApplicationCommandBasicOption,
	APIApplicationCommandIntegerOption,
	APIApplicationCommandOption,
} from "discord-api-types/v10"
import { BOSS } from "./types.ts"
import { Array, Pipe, Record } from "../Lib/pure.ts"
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type NewCommand,
} from "../Discord/types.ts"

const _KILL = {
	name: "kill",
	description: "Update kill time for a boss",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "boss",
			description: "Which boss died?",
			required: true,
			choices: Pipe(
				Record.Keys(BOSS),
				Array.map(x => ({ name: x, value: x })),
			),
		} satisfies APIApplicationCommandBasicOption,
		{
			type: ApplicationCommandOptionType.Integer,
			name: "elapsed",
			description: "When the boss died. Defaults to 0.",
			required: false,
		} satisfies APIApplicationCommandIntegerOption,
	] satisfies APIApplicationCommandOption[],
	type: ApplicationCommandType.ChatInput,
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild],
} as const satisfies NewCommand

export const COMMANDS: NewCommand[] = [_KILL]
