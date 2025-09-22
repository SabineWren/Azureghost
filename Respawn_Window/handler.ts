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

import { Array, DateTime, Dict, Option, Record, Pipe } from "../Lib/pure.ts"
import { KillTimeOption } from "./Command.types.ts"
import { GetKills, UpdateKill, UpdateTime } from "./db.ts"
import { ComputeRespawnWindows } from "./pure.ts"
import { BOSS, Kill } from "./types.ts"

export const PREFIX_BOSS_NAME = "boss_name"
export const ID_SEP = "__"

export const HandleKill = async (
	gId: GuildId,
	option: InteractionDataOption.ApplicationCommandString,
	dateTimeOptions: readonly InteractionDataOption.ApplicationCommandInt[],
): Promise<APIInteractionResponse> => {
	const bossName = option.value as keyof typeof BOSS
	const now = Temporal.Now.zonedDateTimeISO()
	/*
	TODO:
	1. Change args to partial PlainTimeTime args.
	2. If args negative, use 'now' then subtract.
	   ex. { hours: -1, minutes: 42 } --> from({ minutes: 42 }).subtract({ hours: 1 })
	*/
	const getOption = (k: keyof typeof KillTimeOption) => Pipe(
		dateTimeOptions,
		Array.findFirst(x => x.name === KillTimeOption[k].name),
		Option.map(x => x.value),
	)
	const days = getOption("day")

	await Pipe(
		0,
		x => now.subtract({ minutes: x }),
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
