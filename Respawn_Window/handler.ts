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
import * as Db from "./db.ts"
import { ComputeRespawnWindows } from "./pure.ts"
import { type BossName, BossNames, BossKill } from "./types.ts"

export const Clear = (cmd: Interaction.ApplicationCommand): Promise<APIInteractionResponse> => Pipe(
	Option.Do,
	Option.bind("gId", () => Option.fromNullable(cmd.guild_id)),
	Option.bind("bossName", () => Pipe(
		ParseCommandString(0, cmd),
		Option.map(x => x.value),
		Option.flatMap(x => Array.findFirst(BossNames, y => y === x)),
	)),
	Option.map(async ({ gId, bossName }): Promise<APIInteractionResponse> => {
		await Db.TimeRemove(gId, bossName)
		const tz = await Db.TimeZoneGet(gId)
		return Db.GetKills(gId).then(msgRespawnWindows(tz))
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

export const Emoji = (cmd: Interaction.ApplicationCommand): Promise<APIInteractionResponse> => Pipe(
	Option.Do,
	Option.bind("gId", () => Option.fromNullable(cmd.guild_id)),
	Option.bind("bossName", () => Pipe(
		ParseCommandString(0, cmd),
		Option.map(x => x.value),
		Option.flatMap(x => Array.findFirst(BossNames, y => y === x)),
	)),
	Option.let("emoji", () => Pipe(
		ParseCommandString(1, cmd),
		Option.map(x => x.value),
	)),
	Option.map(async ({ gId, bossName, emoji }): Promise<APIInteractionResponse> => {
		await Db.EmojiSet(gId, bossName, emoji)
		const tz = await Db.TimeZoneGet(gId)
		return Db.GetKills(gId).then(msgRespawnWindows(tz))
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

export const Kill = (cmd: Interaction.ApplicationCommand): Promise<APIInteractionResponse> => Pipe(
	Option.Do,
	Option.bind("gId", () => Option.fromNullable(cmd.guild_id)),
	Option.bind("bossName", () => Pipe(
		ParseCommandString(0, cmd),
		Option.map(x => x.value),
		Option.flatMap(x => Array.findFirst(BossNames, y => y === x)),
	)),
	Option.let("options", () => GetCommandOptions(cmd)
		.filter(x => x.type === ApplicationCommandOptionType.Integer)
	),
	Option.map(async ({ gId, bossName, options }): Promise<APIInteractionResponse> => {
		const tz = await Db.TimeZoneGet(gId)
		const now = Temporal.Now.zonedDateTimeISO().withTimeZone(tz)
		const d = Pipe(
			options,
			Array.map(x => [x.name, x.value] as const),
			xs => DateTime.ZonedDateTimeWith(now, xs),
		)
		if (d.epochMilliseconds > now.epochMilliseconds)
			return msgError("Error - You entered a kill time in the future: " + DateTime.ToUnix(d))
		else {
			await Db.TimeSave(gId, Option.fromNullable(cmd.channel_id), bossName, d)
			return Db.GetKills(gId).then(msgRespawnWindows(tz))
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

export const TimeZone = (cmd: Interaction.ApplicationCommand): Promise<APIInteractionResponse> => Pipe(
	Option.Do,
	Option.bind("gId", () => Option.fromNullable(cmd.guild_id)),
	Option.bind("timezone", () => Pipe(
		ParseCommandString(0, cmd),
		Option.map(x => x.value),
	)),
	Option.map(async ({ gId, timezone }): Promise<APIInteractionResponse> => {
		await Db.TimeZoneSet(gId, timezone)
		return msgNormal("TimeZone set to " + timezone)
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

const msgRespawnWindows = (tz: string) => (kills: readonly BossKill[]): APIInteractionResponse => {
	const output = ComputeRespawnWindows(tz, kills)

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

const msgNormal = (s: string): APIInteractionResponse => {
	const text: APIMessageComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		content: s,
	}
	const container: APIContainerComponent = {
		type: MessageComponentTypes.CONTAINER,
		accent_color: 0x00CC00,
		components: [text]
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2 | InteractionResponseFlags.EPHEMERAL,
		components: [container],
	}
	return { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: data }
}
