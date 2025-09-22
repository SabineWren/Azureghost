import { S, Pipe } from "../Lib/pure.ts"
import { ApplicationCommandOptionType } from "./Enum.types.ts"
import { Snowflake } from "./Root.types.ts"

const base = S.Struct({ name: S.String })
export const ApplicationCommandAttachment = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.Attachment),
	value: Snowflake,
})
export const ApplicationCommandBoolean = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.Boolean),
	value: S.Boolean,
})
export const ApplicationCommandChannel = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.Channel),
	value: Snowflake,
})
export const ApplicationCommandInt = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.Integer),
	value: S.Int,
	focused: S.Optional(S.Boolean),
})
export const ApplicationCommandMentionable = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.Mentionable),
	value: Snowflake,
})
export const ApplicationCommandNumber = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.Number),
	value: S.Number,
	focused: S.Optional(S.Boolean),
})
export const ApplicationCommandRole = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.Role),
	value: Snowflake,
})
export const ApplicationCommandString = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.String),
	value: S.String,
	focused: S.Optional(S.Boolean),
})
export const ApplicationCommandUser = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.User),
	value: Snowflake,
})

export const ApplicationCommandSubcommand = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.Subcommand),
	options: S.Array(
		S.Suspend((): S.Schema<ApplicationCommand, applicationCommandE> => ApplicationCommand),
	),
})
export const ApplicationCommandSubcommandGroup = S.Struct({
	...base.fields,
	type: S.Literal(ApplicationCommandOptionType.SubcommandGroup),
	options: S.Array(
		S.Suspend((): S.Schema<ApplicationCommand, applicationCommandE> => ApplicationCommand),
	),
})

/** @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-interaction-data-option-structure} */
export const ApplicationCommand = S.Union(
	// Leaves
	ApplicationCommandAttachment,
	ApplicationCommandBoolean,
	ApplicationCommandChannel,
	ApplicationCommandInt,
	ApplicationCommandMentionable,
	ApplicationCommandNumber,
	ApplicationCommandRole,
	ApplicationCommandString,
	ApplicationCommandUser,
	// Roots
	ApplicationCommandSubcommand,
	ApplicationCommandSubcommandGroup,
)

type base = { name: string }
export type ApplicationCommandAttachment = typeof ApplicationCommandAttachment.Type
export type ApplicationCommandBoolean = typeof ApplicationCommandBoolean.Type
export type ApplicationCommandChannel = typeof ApplicationCommandChannel.Type
export type ApplicationCommandInt = typeof ApplicationCommandInt.Type
export type ApplicationCommandMentionable = typeof ApplicationCommandMentionable.Type
export type ApplicationCommandNumber = typeof ApplicationCommandNumber.Type
export type ApplicationCommandRole = typeof ApplicationCommandRole.Type
export type ApplicationCommandString = typeof ApplicationCommandString.Type
export type ApplicationCommandUser = typeof ApplicationCommandUser.Type
export type ApplicationCommandSubcommand = base & {
	type: typeof ApplicationCommandOptionType.Subcommand
	options: readonly ApplicationCommand[]
}
export type ApplicationCommandSubcommandGroup = base & {
	type: typeof ApplicationCommandOptionType.SubcommandGroup
	options: readonly ApplicationCommand[]
}

export type ApplicationCommand =
	// Leaves
	| ApplicationCommandAttachment
	| ApplicationCommandBoolean
	| ApplicationCommandChannel
	| ApplicationCommandInt
	| ApplicationCommandMentionable
	| ApplicationCommandNumber
	| ApplicationCommandRole
	| ApplicationCommandString
	| ApplicationCommandUser
	// Roots
	| ApplicationCommandSubcommand
	| ApplicationCommandSubcommandGroup

// Schemas get gnarly here because trees are mutually recursive. Typedefs enforce correctness.
// https://github.com/Effect-TS/effect/issues/2874
type applicationCommandE =
	// Leaves
	| typeof ApplicationCommandAttachment.Encoded
	| typeof ApplicationCommandBoolean.Encoded
	| typeof ApplicationCommandChannel.Encoded
	| typeof ApplicationCommandInt.Encoded
	| typeof ApplicationCommandMentionable.Encoded
	| typeof ApplicationCommandNumber.Encoded
	| typeof ApplicationCommandRole.Encoded
	| typeof ApplicationCommandString.Encoded
	| typeof ApplicationCommandUser.Encoded
	// Roots
	| base & {
		type: typeof ApplicationCommandOptionType.Subcommand
		options: readonly applicationCommandE[]
	}
	| base & {
		type: typeof ApplicationCommandOptionType.SubcommandGroup
		options: readonly applicationCommandE[]
	}
