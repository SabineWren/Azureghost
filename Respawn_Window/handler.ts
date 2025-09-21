import type {
	APIInteractionResponse,
	APIInteractionResponseCallbackData,
	APIMessageTopLevelComponent,
} from "discord-api-types/v10"
import {
	ButtonStyleTypes,
	InteractionDataOption,
	InteractionResponseFlags,
	InteractionResponseType,
	MessageComponentTypes,
} from "../Discord/types.ts"

import { CopyWith, Option, Pipe } from "../Lib/pure.ts"
import { } from "./Command.types.ts"
import { ComputeRespawnWindows } from "./pure.ts"
import { BOSS, Kill, MONTH } from "./types.ts"

const input: Kill[] = [
	{
		Boss: BOSS.Azuregos,
		At: Temporal.PlainDateTime.from({ year: 2025, month: MONTH.Jan, day: 1, hour: 14, minute: 5 }),
	},
]

export const PREFIX_BOSS_NAME = "boss_name"
export const ID_SEP = "__"

export const HandleKill = (
	option: InteractionDataOption.ApplicationCommandString,
	optionTime: Option<InteractionDataOption.ApplicationCommandInt>,
): APIInteractionResponse => {
	const bossName = option.value as keyof typeof BOSS
	const time = Pipe(
		optionTime,
		Option.flatMapNullable(x => x.value as number),
		Option.getOrElse(() => 0),
	)
	console.log("time...", time)

	const output = ComputeRespawnWindows(input)

	const text: APIMessageTopLevelComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		content: output,
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2,
		components: [text],
	}
	return { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: data }
}
