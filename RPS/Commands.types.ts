
import type { APIApplicationCommandOption } from "discord-api-types/v10"
import { RuleDetail } from "./types.ts"
import { Array, Pipe, Record } from "../Lib/pure.ts"
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type NewCommand,
} from "../Discord/types.ts"


const createCommandChoices = () => Pipe(
	Record.Keys(RuleDetail),
	Array.map(x => ({ name: x, value: x.toLowerCase() })),
)

const _TEST: NewCommand = {
	name: "test",
	description: "Basic command",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
}

const _CHALLENGE_OPTION = {
	type: ApplicationCommandOptionType.String,
	name: "object",
	description: "Pick your object",
	required: true,
	choices: createCommandChoices(),
} as const satisfies APIApplicationCommandOption

const _CHALLENGE = {
	name: "challenge",
	description: "Challenge to a match of rock paper scissors",
	options: [_CHALLENGE_OPTION],
	type: ApplicationCommandType.ChatInput,
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [
		InteractionContextType.Guild,
		InteractionContextType.PrivateChannel,
	],
} as const satisfies NewCommand

export const ALL_COMMANDS: NewCommand[] = [_TEST, _CHALLENGE]
