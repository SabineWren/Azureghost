import type {
	APIApplicationCommandInteractionDataStringOption,
	APIApplicationCommandInteraction,
	APIInteractionResponse,
	APIInteractionResponseCallbackData,
	APIMessageTopLevelComponent,
} from "discord-api-types/v10"
import {} from "discord-interactions"
import {
	ButtonStyleTypes,
	InteractionResponseFlags,
	InteractionResponseType,
	MessageComponentTypes,
} from "../Discord/types.ts"
import { Pipe } from "../Lib/pure.ts"
import { DecideOutcome } from "./pure.ts"
import { ShuffleOptions } from "./random.ts"
import type { RuleName } from "./types.ts"

// Store for in-progress games. In production, you'd want to use a DB
const activeGames: Record<string, { id: string, objectName: RuleName }> = {}

export const PREFIX_ACCEPT = "accept_button"
export const PREFIX_SELECT = "select_choice"
export const ID_SEP = "__"

export const HandleChallenge = (
	interactionId: string,
	userId: string,
	option: APIApplicationCommandInteractionDataStringOption,
): APIInteractionResponse => {
	// Create active game using message ID as the game ID
	activeGames[interactionId] = {
		id: userId,
		objectName: option.value as RuleName,
	}

	const text: APIMessageTopLevelComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		// Fetches a random emoji to send from a helper function
		content: `Rock papers scissors challenge from <@${userId}>`,
	}
	const actions: APIMessageTopLevelComponent = {
		type: MessageComponentTypes.ACTION_ROW,
		components: [
			{
				type: MessageComponentTypes.BUTTON,
				// Append the game ID to use later on
				custom_id: PREFIX_ACCEPT + ID_SEP + interactionId,
				label: "Accept",
				style: ButtonStyleTypes.PRIMARY,
			},
		],
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2,
		components: [text, actions],
	}
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: data,
	}
}

export const HandleOptionAccept = (gameId: string): APIInteractionResponse => {
	const text: APIMessageTopLevelComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		content: "What is your object of choice?",
	}
	const actions: APIMessageTopLevelComponent = {
		type: MessageComponentTypes.ACTION_ROW,
		components: [
			{
				type: MessageComponentTypes.STRING_SELECT,
				custom_id: PREFIX_ACCEPT + ID_SEP + gameId,
				options: ShuffleOptions(),
			},
		],
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2 | InteractionResponseFlags.EPHEMERAL,
		components: [text, actions],
	}
	return { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: data }
}

export const HandleOptionSelect = (gameId: string, userId: string, option: string): APIInteractionResponse => {
	const outcome: string = activeGames[gameId]
		? DecideOutcome(activeGames[gameId], { id: userId, objectName: option as RuleName })
		: ("No game found " + gameId)

	delete activeGames[gameId]

	const text: APIMessageTopLevelComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		content: outcome,
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2,
		components: [text],
	}
	return { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: data }
}

export const HandleTest = (cmd: APIApplicationCommandInteraction): APIInteractionResponse => {
	const text: APIMessageTopLevelComponent = {
		type: MessageComponentTypes.TEXT_DISPLAY,
		content: "Hello World!!",
	}
	const data: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2,
		components: [text],
	}
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: data,
	}
}
