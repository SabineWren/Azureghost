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

import { CopyWith, DateTime, Option, Record, Pipe } from "../Lib/pure.ts"
import { } from "./Command.types.ts"
import { ComputeRespawnWindows } from "./pure.ts"
import { BOSS, Kill, MONTH } from "./types.ts"

const tInitial = Temporal.PlainDateTime.from({ year: 2025, month: MONTH.Jan, day: 1, hour: 14, minute: 5 })
let state = Record.MapValues(BOSS, (v, k): Kill => ({ Boss: v, At: tInitial }))

export const PREFIX_BOSS_NAME = "boss_name"
export const ID_SEP = "__"

export const HandleKill = (
	option: InteractionDataOption.ApplicationCommandString,
	optionTime: Option<InteractionDataOption.ApplicationCommandInt>,
): APIInteractionResponse => {
	const time = Pipe(
		optionTime,
		Option.flatMapNullable(x => x.value),
		Option.getOrElse(() => 0),
		x => Temporal.Now.zonedDateTimeISO().subtract({ minutes: x }),
		x => x.toPlainDateTime(),
	)
	const bossName = option.value as keyof typeof BOSS
	state[bossName] = CopyWith(state[bossName], { At: time })
	console.log("time: ", DateTime.Format(time))

	const output = ComputeRespawnWindows(Record.Values(state))

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
