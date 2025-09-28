import type {
	APIContainerComponent,
	APIInteractionResponse,
	APIInteractionResponseCallbackData,
	APIMessageComponent,
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
import { GetKills, SaveTime } from "./db.ts"
import { ComputeRespawnWindows } from "./pure.ts"
import { BOSS, type BossName, Kill } from "./types.ts"

const bossNames = Record.Keys(BOSS)

export const HandleKill = (cmd: Interaction.ApplicationCommand): Promise<APIInteractionResponse> => Pipe(
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
	Option.map(async ({ gId, bossName, options }): Promise<APIInteractionResponse> => {
		const now = Temporal.Now.zonedDateTimeISO().withTimeZone("UTC")
		const d = Pipe(
			options,
			Array.map(x => [x.name, x.value] as const),
			xs => DateTime.ZonedDateTimeWith(now, xs),
		)
		if (d.epochMilliseconds > now.epochMilliseconds)
			return msgError("Error - You entered a kill time in the future: " + DateTime.ToUnix(d))
		else {
			await SaveTime(gId, bossName, d)
			return GetKills(gId).then(msgRespawnWindows)
		}
	}),
	Option.getOrElse((): Promise<APIInteractionResponse> => Pipe(
		[
			"Error - Bad command arguments",
			cmd.data.name,
			JSON.stringify(cmd.data.type === ApplicationCommandType.ChatInput ? cmd.data.options : cmd.data.type),
		].join("; "),
		msgError,
		x => Promise.resolve(x),
	)),
)

const msgRespawnWindows = (kills: readonly Kill[]): APIInteractionResponse => {
	const output = ComputeRespawnWindows(kills)

	const text: APIMessageComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		content: output,
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2,
		components: [text],
	}
	return { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: data }
}

const msgError = (s: string): APIInteractionResponse => {
	const text: APIMessageComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		content: s,
	}
	const container: APIContainerComponent = {
		type: MessageComponentTypes.CONTAINER,
		accent_color: 0xFF0000,
		components: [text]
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2 | InteractionResponseFlags.EPHEMERAL,
		components: [container],
	}
	return { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: data }
}
