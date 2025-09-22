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
import {} from "./Command.types.ts"
import { GetKills, UpdateKill, UpdateTime } from "./db.ts"
import { AlterDateTime, ComputeRespawnWindows } from "./pure.ts"
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

	await Pipe(
		dateTimeOptions,
		Array.map(x => [x.name as Temporal.DateTimeUnit, x.value] as const),
		x => AlterDateTime(now, x),
		x => x.toPlainDateTime(),
		x => UpdateTime(gId, bossName, x),
	) satisfies void

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
