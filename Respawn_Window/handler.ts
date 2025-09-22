import type {
	APIInteractionResponse,
	APIInteractionResponseCallbackData,
	APIMessageTopLevelComponent,
} from "discord-api-types/v10"
import {
	ButtonStyleTypes,
	GuildId,
	InteractionDataOption,
	InteractionResponseFlags,
	InteractionResponseType,
	MessageComponentTypes,
} from "../Discord/types.ts"

import { DateTime, Dict, Option, Record, Pipe } from "../Lib/pure.ts"
import { } from "./Command.types.ts"
import { GetKills, UpdateKill, UpdateTime } from "./db.ts"
import { ComputeRespawnWindows } from "./pure.ts"
import { BOSS, Kill, MONTH } from "./types.ts"

export const PREFIX_BOSS_NAME = "boss_name"
export const ID_SEP = "__"

export const HandleKill = async (
	gId: GuildId,
	option: InteractionDataOption.ApplicationCommandString,
	optionTime: Option<InteractionDataOption.ApplicationCommandInt>,
): Promise<APIInteractionResponse> => {
	const bossName = option.value as keyof typeof BOSS
	/*
	TODO:
	1. Change args to partial PlainTimeTime args.
	2. If args negative, use 'now' then subtract.
	   ex. { hours: -1, minutes: 42 } --> from({ minutes: 42 }).subtract({ hours: 1 })
	3. Move this to logic pure code
	*/
	await Pipe(
		optionTime,
		Option.flatMapNullable(x => x.value),
		Option.getOrElse(() => 0),
		x => Temporal.Now.zonedDateTimeISO().subtract({ minutes: x }),
		x => x.toPlainDateTime(),
		time => UpdateTime(gId, bossName, time)
	)

	const output = Pipe(
		await GetKills(gId),
		Dict.Values,
		ComputeRespawnWindows,
	)

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
