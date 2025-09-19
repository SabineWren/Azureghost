import { S, Pipe } from "../Lib/pure.ts"
import { SelectOption, SelectOptionValue } from "./Component.types.ts"
import { ApplicationCommandOptionType, ApplicationCommandType, MessageComponentTypes } from "./Enum.types.ts"
import * as InteractionDataOption from "./InteractionDataOption.types.ts"
import { componentInteractionResponse, resolved, Snowflake } from "./Root.types.ts"

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data
const command = S.Struct({
	id: Snowflake,
	name: S.String,
	type: S.Enum(ApplicationCommandType),
	resolved: S.Optional(resolved),
	options: S.Optional(S.Array(InteractionDataOption.ApplicationCommand)),
	guild_id: S.Optional(Snowflake),
	target_id: S.Optional(Snowflake),
})
export const ApplicationCommand = command
export const ApplicationCommandAutocomplete = command
export const MessageComponent = S.Struct({
	custom_id: S.String,
	component_type: S.Enum(MessageComponentTypes),
	/** Values the user selected in a select menu component */
	values: S.Optional(S.Array(SelectOptionValue)),
	/** Resolved entities from selected options */
	resolved: S.Optional(resolved),
})
export const ModalSubmit = S.Struct({
	custom_id: S.String,
	/** Values submitted by user */
	components: S.Array(componentInteractionResponse),
	/** Resolved entities from selected options */
	resolved: S.Optional(resolved),
})

export type ApplicationCommand = typeof ApplicationCommand.Type
export type ApplicationCommandAutocomplete = typeof ApplicationCommandAutocomplete.Type
export type MessageComponent = typeof MessageComponent.Type
export type ModalSubmit = typeof ModalSubmit.Type
