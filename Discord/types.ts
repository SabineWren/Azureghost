import type { APIApplicationCommand } from "discord-api-types/v10"
import type {
	ButtonStyleTypes as ButtonStyleTypesEnum,
	InteractionResponseFlags as InteractionResponseFlagsEnum,
	InteractionResponseType as InteractionResponseTypeEnum,
	InteractionType as InteractionTypeEnum,
	MessageComponentTypes as MessageComponentTypesEnum,
} from "discord-interactions"

// Re-export enums as pojos.
// Libs use different TS enums, which break typing despite using the same values.

// This seems to work, but I can't find it in either existing types library.
export type NewCommand = Omit<
	APIApplicationCommand,
	| "application_id"
	| "id"
	| "default_member_permissions"
	| "version"
>

/**
 * @see {@link https://discord.com/developers/docs/components/reference#button-button-styles}
 */
export const ButtonStyleTypes = {
	/** The most important or recommended action in a group of options. */
	PRIMARY: 1,
	/** Alternative or supporting actions */
	SECONDARY: 2,
	/** Positive confirmation or completion actions */
	SUCCESS: 3,
	/** An action with irreversible consequences. */
	DANGER: 4,
	/** Navigates to a URL */
	LINK: 5,
	/** Purchase */
	PREMIUM: 6,
} as const satisfies typeof ButtonStyleTypesEnum
export type ButtonStyleTypes = valuesOf<typeof ButtonStyleTypes>

export const InteractionResponseFlags = {
	/** Show the message only to the user that performed the interaction.
	  * Message does not persist between sessions.
	  */
	EPHEMERAL: 64,
	/** Allows you to create fully component-driven messages
	  * @see {@link https://discord.com/developers/docs/components/reference}
	  */
	IS_COMPONENTS_V2: 32768,
} as const satisfies typeof InteractionResponseFlagsEnum
export type InteractionResponseFlags = valuesOf<typeof InteractionResponseFlags>

export const InteractionResponseType = {
	/** Acknowledge a `PING` */
	PONG: 1,
	/** Respond with a message, showing the user's input. */
	CHANNEL_MESSAGE_WITH_SOURCE: 4,
	/** Acknowledge a command without sending a message, showing the user's input. Requires follow-up. */
	DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
	/** Acknowledge an interaction and edit the original message that contains the component later; the user does not see a loading state. */
	DEFERRED_UPDATE_MESSAGE: 6,
	/** Edit the message the component was attached to. */
	UPDATE_MESSAGE: 7,
	APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
	MODAL: 9,
	PREMIUM_REQUIRED: 10,
	LAUNCH_ACTIVITY: 12,
} as const satisfies typeof InteractionResponseTypeEnum
export type InteractionResponseType = valuesOf<typeof InteractionResponseType>

export const InteractionType = {
	PING: 1,
	APPLICATION_COMMAND: 2,
	MESSAGE_COMPONENT: 3,
	APPLICATION_COMMAND_AUTOCOMPLETE: 4,
	MODAL_SUBMIT: 5,
} as const satisfies typeof InteractionTypeEnum
export type InteractionType = valuesOf<typeof InteractionType>

/**
 * The type of component
 * @see {@link https://discord.com/developers/docs/components/reference#what-is-a-component}
 */
export const MessageComponentTypes = {
	ACTION_ROW: 1,
	BUTTON: 2,
	STRING_SELECT: 3,
	INPUT_TEXT: 4,
	USER_SELECT: 5,
	ROLE_SELECT: 6,
	MENTIONABLE_SELECT: 7,
	CHANNEL_SELECT: 8,
	SECTION: 9,
	TEXT_DISPLAY: 10,
	THUMBNAIL: 11,
	MEDIA_GALLERY: 12,
	FILE: 13,
	SEPARATOR: 14,
	CONTAINER: 17,
} as const satisfies typeof MessageComponentTypesEnum
export type MessageComponentTypes = valuesOf<typeof MessageComponentTypes>

type valuesOf<T> = T[keyof T]
