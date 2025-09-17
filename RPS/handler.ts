import type {
	APIInteraction,
	APIApplicationCommand,
	APIApplicationCommandInteraction,
	APIInteractionResponse,
	APIInteractionResponseCallbackData,
} from "discord-api-types/v10"
import {} from "discord-interactions"
import {
	ButtonStyleTypes,
	InteractionResponseFlags,
	InteractionResponseType,
	MessageComponentTypes,
} from "../Discord/types.ts"

// Store for in-progress games. In production, you'd want to use a DB
const activeGames: Record<string, { id: string, objectName: any }> = {}

export const HandleChallenge = (
	interaction: APIApplicationCommandInteraction,
	userId: string,
	reqBodyId: any,
	objectName: any,
): APIInteractionResponse => {
	// Create active game using message ID as the game ID
	activeGames[interaction.id] = {
		id: userId,
		objectName,
	}

	const respPayload: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2,
		components: [
			{
				type: MessageComponentTypes.TEXT_DISPLAY,
				// Fetches a random emoji to send from a helper function
				content: `Rock papers scissors challenge from <@${userId}>`,
			},
			{
				type: MessageComponentTypes.ACTION_ROW,
				components: [
					{
						type: MessageComponentTypes.BUTTON,
						// Append the game ID to use later on
						custom_id: `accept_button_${reqBodyId}`,
						label: "Accept",
						style: ButtonStyleTypes.PRIMARY,
					},
				],
			},
		],
	}
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: respPayload,
	}
}

export const HandleTest = (cmd: APIApplicationCommandInteraction): APIInteractionResponse => {
	const respPayload: APIInteractionResponseCallbackData = {
		flags: InteractionResponseFlags.IS_COMPONENTS_V2,
		components: [
			{
				type: MessageComponentTypes.TEXT_DISPLAY,
				content: "Hello World!!",
			},
		],
	}
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: respPayload,
	}
}
