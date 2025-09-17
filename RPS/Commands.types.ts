
import { RuleDetail } from "./types.ts"
import { Array, Pipe, Record } from "../Lib/pure.ts"
import type { NewCommand } from "../Discord/types.ts"

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

const _CHALLENGE: NewCommand = {
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

export const ALL_COMMANDS: NewCommand[] = [_TEST, _CHALLENGE]
