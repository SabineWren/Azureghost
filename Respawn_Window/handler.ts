import type {
	APIApplicationCommandInteractionDataStringOption,
	APIApplicationCommandInteraction,
	APIInteractionResponse,
	APIInteractionResponseCallbackData,
	APIMessageTopLevelComponent,
} from "discord-api-types/v10"
import {
	ButtonStyleTypes,
	InteractionResponseFlags,
	InteractionResponseType,
	MessageComponentTypes,
} from "../Discord/types.ts"

import { } from "./Command.types.ts"
import { ComputeRespawnWindows } from "./pure.ts"
import { BOSS, Kill, MONTH } from "./types.ts"

export const PREFIX_BOSS_NAME = "boss_name"
export const ID_SEP = "__"

export const HandleKill = (
	interactionId: string,
	option: APIApplicationCommandInteractionDataStringOption,
): APIInteractionResponse => {
	const bossName = option.value as keyof typeof BOSS

	const text: APIMessageTopLevelComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		content: `Update kill time for ${bossName}`,
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2 | InteractionResponseFlags.EPHEMERAL,
		components: [text],
	}
	return { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: data }
}

const input: Kill[] = [
	{
		Boss: BOSS.Azuregos,
		At: Temporal.PlainDateTime.from({ year: 2025, month: MONTH.Jan, day: 1, hour: 14, minute: 5 }),
	},
]

const output = ComputeRespawnWindows(input)
const payload = {
	"username": "Boss Timers",
	"content": output,
}
// console.log(JSON.stringify(payload))
