import { S, Pipe } from "../Lib/pure.ts"
import { InteractionContextType, InteractionType } from "./Enum.types.ts"
import * as InteractionData from "./InteractionData.types.ts"
import { Channel, Entitlement, Guild, GuildMember, Message, Snowflake, User } from "./Root.types.ts"

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
export const ApplicationCommand = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.APPLICATION_COMMAND),
	data: InteractionData.ApplicationCommand,
	locale: S.String,
})
export const ApplicationCommandAutocomplete = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE),
	data: InteractionData.ApplicationCommandAutocomplete,
	locale: S.String,
})
export const MessageComponent = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.MESSAGE_COMPONENT),
	data: InteractionData.MessageComponent,
	locale: S.String,
})
export const ModalSubmit = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.MODAL_SUBMIT),
	data: InteractionData.ModalSubmit,
	locale: S.String,
})
export const Ping = S.Struct({
	...interactionBase.fields,
	type: S.Literal(InteractionType.PING),
})
/** https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object */
export const Interaction = S.Union(
	ApplicationCommand,
	ApplicationCommandAutocomplete,
	MessageComponent,
	ModalSubmit,
	Ping,
)

export type ApplicationCommand = typeof ApplicationCommand.Type
export type ApplicationCommandAutocomplete = typeof ApplicationCommandAutocomplete.Type
export type MessageComponent = typeof MessageComponent.Type
export type ModalSubmit = typeof ModalSubmit.Type
export type Ping = typeof Ping.Type
export type Interaction = typeof Interaction.Type
