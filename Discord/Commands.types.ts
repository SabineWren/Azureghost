import type { APIApplicationCommand } from "discord-api-types/v10"
import { RuleDetail } from "./Game.types.ts"
import { Array, Pipe, Record } from "../Lib/math.ts"

type newCommand = Omit<
	APIApplicationCommand,
	| "application_id"
	| "id"
	| "default_member_permissions"
	| "version"
>

const createCommandChoices = () => Pipe(
	Record.Keys(RuleDetail),
	Array.map(x => ({ name: x, value: x.toLowerCase() })),
)

const _TEST: newCommand = {
	name: "test",
	description: "Basic command",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
}

const _CHALLENGE: newCommand = {
	name: "challenge",
	description: "Challenge to a match of rock paper scissors",
	options: [
		{
			type: 3,
			name: "object",
			description: "Pick your object",
			required: true,
			choices: createCommandChoices(),
		},
	],
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 2],
}

export const ALL_COMMANDS: newCommand[] = [_TEST, _CHALLENGE]
