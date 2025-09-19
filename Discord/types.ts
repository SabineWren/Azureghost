import { S, Pipe } from "../Lib/pure.ts"
import {
	ApplicationCommandOptionType,
	InteractionContextType,
	InteractionType,
	MessageComponentTypes,
} from "./Enum.types.ts"

export * from "./Enum.types.ts"

/** @see {@link https://discord.com/developers/docs/reference#snowflakes} */
export const Snowflake = Pipe(S.String, S.Brand("Snowflake"))
export type Snowflake = typeof Snowflake.Type

// https://discord.com/developers/docs/resources/guild#guild-object
const Guild = S.Any// TODO

// partial emoji object	id, name, and animated
const Emoji = S.Any// TODO

/** @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure} */
const resolved = S.Any// TODO

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-component-interaction-response-structures
const componentInteractionResponse = S.Any// TODO

// https://discord.com/developers/docs/resources/channel#channel-object
const Channel = S.Any// TODO

// https://discord.com/developers/docs/resources/guild#guild-member-object
const GuildMember = S.Any// TODO

// https://discord.com/developers/docs/resources/user#user-object
const User = S.Any// TODO

// https://discord.com/developers/docs/resources/message#message-object
const Message = S.Any// TODO

// https://discord.com/developers/docs/resources/entitlement#entitlement-object
const Entitlement = S.Any// TODO

const SelectOption = S.Struct({
	/** User-facing name of the option */
	label: Pipe(S.String, S.MaxLength(100)),
	/** Dev-defined value of the option */
	value: Pipe(S.String, S.MaxLength(100)),
	/** Additional description of the option */
	description: Pipe(S.String, S.MaxLength(100), S.Optional),
	/** partial emoji object	id, name, and animated */
	emoji: S.Optional(Emoji),
	/** Will show this option as selected by default */
	default: S.Optional(S.Boolean),
})

const SelectOptionValue = S.Struct({
	type: S.Literal(ApplicationCommandOptionType.String),
	/** Optional identifier for component */
	id: S.Optional(S.Int),
	/** ID for the select menu */
	custom_id: Pipe(S.String, S.MaxLength(200)),
	/** Specified choices in a select menu */
	options: Pipe(S.Array(SelectOption), S.MaxItems(25)),
	/** Placeholder text if nothing is selected or default */
	placeholder: S.Optional(Pipe(S.String, S.MaxLength(150))),
	/** Minimum number of items that must be chosen (defaults to 1) */
	min_values: S.Optional(Pipe(S.Int, S.Clamp(0, 25))),
	/** Maximum number of items that can be chosen (defaults to 1) */
	max_values: S.Optional(Pipe(S.Int, S.Clamp(0, 25))),
	/** Whether the string select is required to answer in a modal (defaults to true) */
	required: S.Optional(S.Boolean),
	/** Whether select menu is disabled in a message (defaults to false) */
	disabled: S.Optional(S.Boolean),
})

// ************ Interaction data payloads ************

/** @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-interaction-data-option-structure} */
export const ApplicationCommandIDataOption = S.Struct({
	name: S.String,
	type: S.Enum(ApplicationCommandOptionType),
	/** User input */
	value: S.Optional(S.Union(S.String, S.Int, S.Number, S.Boolean)),
	/** Present if this option is a group or subcommand */
	options: S.Optional(S.Array(
		S.Suspend((): S.Schema<ApplicationCommandIDataOption> => ApplicationCommandIDataOption),
	)),
	/** true if this option is the currently focused option for autocomplete */
	focused: S.Optional(S.Boolean),
})
type ApplicationCommandIDataOption = {
	name: string
	type: ApplicationCommandOptionType
	value?: undefined | string | number | boolean
	options?: undefined |  readonly ApplicationCommandIDataOption[]
	focused?: undefined | boolean
}

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data
const iData_CommandBase = S.Struct({
	id: Snowflake,
	name: S.String,
	resolved: S.Optional(resolved),
	options: S.Optional(S.Array(ApplicationCommandIDataOption)),
	guild_id: S.Optional(Snowflake),
	target_id: S.Optional(Snowflake),
})
export const IData_ApplicationCommand = S.Struct({
	...iData_CommandBase.fields,
	type: S.Literal(InteractionType.APPLICATION_COMMAND),
})
export const IData_ApplicationCommandAutocomplete = S.Struct({
	...iData_CommandBase.fields,
	type: S.Literal(InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE),
})
export const IData_MessageComponent = S.Struct({
	custom_id: S.String,
	component_type: S.Enum(MessageComponentTypes),
	/** Values the user selected in a select menu component */
	values: S.Optional(S.Array(SelectOptionValue)),
	/** Resolved entities from selected options */
	resolved: S.Optional(resolved),
})
export const IData_ModalSubmit = S.Struct({
	custom_id: S.String,
	/** Values submitted by user */
	components: S.Array(componentInteractionResponse),
	/** Resolved entities from selected options */
	resolved: S.Optional(resolved),
})

// ************ Interactions ************
const interactionBase = S.Struct({
	id: Snowflake,
	/** ID of the application this interaction is for */
	application_id: Snowflake,
	guild: S.Optional(Guild),
	guild_id: S.Optional(Snowflake),
	channel: S.Optional(Channel),
	channel_id: S.Optional(Snowflake),
	/** Guild member data for the invoking user, including permissions */
	member: S.Optional(GuildMember),
	/** user object	User object for the invoking user, if invoked in a DM */
	user: S.Optional(User),
	/** Continuation token for responding to the interaction */
	token: S.String,
	version: S.Literal(1),
	/** For components or modals triggered by components, the message they were attached to */
	message: S.Optional(Message),
	/** Bitwise set of permissions the app has in the source location of the interaction */
	app_permissions: S.String,
	/** Guild's preferred locale, if invoked in a guild */
	guild_locale: S.Optional(S.String),
	/** For monetized apps, any entitlements for the invoking user, representing access to premium SKUs */
	entitlements: S.Array(Entitlement),
	// TODO not clear how this works.
	// type: dictionary with keys of application integration types
	// desc: Mapping of installation contexts that the interaction was authorized for to related user or guild IDs. See Authorizing Integration Owners Object for details
	authorizing_integration_owners: S.Any,
	/** Context where the interaction was triggered from */
	context: S.Optional(S.Enum(InteractionContextType)),
	attachment_size_limit: S.Int,// in bytes
})
export const IApplicationCommand = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.APPLICATION_COMMAND),
	data: IData_ApplicationCommand,
	locale: S.String,
})
export const IApplicationCommandAutocomplete = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE),
	data: ApplicationCommandIDataOption,
	locale: S.String,
})
export const IMessageComponent = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.MESSAGE_COMPONENT),
	data: IData_MessageComponent,
	locale: S.String,
})
export const IModalSubmit = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.MODAL_SUBMIT),
	data: IData_ModalSubmit,
	locale: S.String,
})
export const IPing = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.PING),
})
/** https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object */
export const Interaction = S.Union(
	IApplicationCommand,
	IApplicationCommandAutocomplete,
	IMessageComponent,
	IModalSubmit,
	IPing,
)

export type DApplicationCommand = typeof IData_ApplicationCommand.Type
export type DApplicationCommandAutocomplete = typeof IData_ApplicationCommandAutocomplete.Type
export type DMessageComponent = typeof IData_MessageComponent.Type
export type DModalSubmit = typeof IData_ModalSubmit.Type

export type IApplicationCommand = typeof IApplicationCommand.Type
export type IApplicationCommandAutocomplete = typeof IApplicationCommandAutocomplete.Type
export type IMessageComponent = typeof IMessageComponent.Type
export type IModalSubmit = typeof IModalSubmit.Type
export type IPing = typeof IPing.Type
export type Interaction = typeof Interaction.Type
