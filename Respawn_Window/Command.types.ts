
import type { APIApplicationCommandOption } from "discord-api-types/v10"
import { BOSS } from "./types.ts"
import { Array, Pipe, Record } from "../Lib/pure.ts"
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type NewCommand,
} from "../Discord/types.ts"

// Formatted for select menus
// https://discord.com/developers/docs/components/reference#string-select-select-option-structure
// export const BossSelectOptions = Pipe(
// 	Record.Keys(BOSS),
// 	Array.map(x => ({
// 		label: x,
// 		value: x,
// 		description: Pipe(BOSS[x], x => x.Name + " " +  x.Emoji),
// 	})),
// )

const _KILL_OPTION = {
	type: ApplicationCommandOptionType.String,
	name: "object",
	description: "Which boss?",
	required: true,
	choices: Pipe(
		Record.Keys(BOSS),
		Array.map(x => ({ name: x, value: x })),
	),
} as const satisfies APIApplicationCommandOption

const _KILL = {
	name: "kill",
	description: "Update kill time for a boss",
	options: [_KILL_OPTION],
	type: ApplicationCommandType.ChatInput,
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild],
} as const satisfies NewCommand

export const COMMANDS: NewCommand[] = [_KILL]
