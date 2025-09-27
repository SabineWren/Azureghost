import type {
	APIInteractionResponse,
	APIInteractionResponseCallbackData,
	APIMessageTopLevelComponent,
} from "discord-api-types/v10"
import { GetCommandOptions, ParseCommandString, ParseUserId } from "../Discord/pure.ts"
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	GuildId,
	Interaction,
	InteractionDataOption,
	InteractionResponseFlags,
	InteractionResponseType,
	MessageComponentTypes,
} from "../Discord/types.ts"

import { Array, DateTime, Dict, Option, Record, Pipe } from "../Lib/pure.ts"
import {} from "./Command.types.ts"
import { GetKills, UpdateKill, UpdateTime } from "./db.ts"
import { ComputeRespawnWindows } from "./pure.ts"
import { BOSS, Kill } from "./types.ts"

const bossNames = Record.Keys(BOSS)
export const PREFIX_BOSS_NAME = "boss_name"
export const ID_SEP = "__"

export type Response =
	| { Status: 400; Error: string }
	| { Status: 200; Payload: APIInteractionResponse }

export const HandleKill = (cmd: Interaction.ApplicationCommand): Promise<Response> => Pipe(
	Option.Do,
	Option.bind("gId", () => Option.fromNullable(cmd.guild_id)),
	Option.bind("bossName", () => Pipe(
		ParseCommandString(0, cmd),
		Option.map(x => x.value),
		Option.flatMap(x => Array.findFirst(bossNames, y => y === x)),
	)),
	Option.let("options", () => GetCommandOptions(cmd)
		.filter(x => x.type === ApplicationCommandOptionType.Integer)
	),
	Option.map(({ gId, bossName, options }): Promise<Response> =>
		handleKill(gId, bossName, options).then(x => ({ Status: 200, Payload: x }))
	),
	Option.getOrElse((): Promise<Response> => Pipe(
		[
			"Error validating command",
			cmd.data.name,
			JSON.stringify(cmd.data.type === ApplicationCommandType.ChatInput ? cmd.data.options : cmd.data.type),
		].join("; "),
		msg => Promise.resolve({ Status: 400, Error: msg }),
	)),
)

const handleKill = async (
	gId: GuildId,
	bossName: keyof typeof BOSS,
	options: InteractionDataOption.ApplicationCommandInt[],
): Promise<APIInteractionResponse> => {
	const now = Temporal.Now.zonedDateTimeISO()

	await Pipe(
		Array.map(options, x => [x.name, x.value] as const),
		xs => DateTime.ZonedDateTimeWith(now, xs),
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
