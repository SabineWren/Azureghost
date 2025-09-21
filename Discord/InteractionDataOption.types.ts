import { S, Pipe } from "../Lib/pure.ts"
import { ApplicationCommandOptionType } from "./Enum.types.ts"
import { Snowflake } from "./Root.types.ts"

type base = { name: string }

export type ApplicationCommandAttachment = base & {
	type: typeof ApplicationCommandOptionType.Attachment
	value: Snowflake
}
export type ApplicationCommandBoolean = base & {
	type: typeof ApplicationCommandOptionType.Boolean
	value: boolean
}
export type ApplicationCommandChannel = base & {
	type: typeof ApplicationCommandOptionType.Channel
	value: Snowflake
}
export type ApplicationCommandInt = base & {
	type: typeof ApplicationCommandOptionType.Integer
	value: number
	focused?: undefined | boolean
}
export type ApplicationCommandMentionable = base & {
	type: typeof ApplicationCommandOptionType.Mentionable
	value: Snowflake
}
export type ApplicationCommandNumber = base & {
	type: typeof ApplicationCommandOptionType.Number
	value: number
	focused?: undefined | boolean
}
export type ApplicationCommandRole = base & {
	type: typeof ApplicationCommandOptionType.Role
	value: Snowflake
}
export type ApplicationCommandString = base & {
	type: typeof ApplicationCommandOptionType.String
	value: string
	focused?: undefined | boolean
}
export type ApplicationCommandUser = base & {
	type: typeof ApplicationCommandOptionType.User
	value: Snowflake
}

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

type applicationCommandAttachmentE = base & {
	type: typeof ApplicationCommandOptionType.Attachment
	value: typeof Snowflake.Encoded
}
type applicationCommandChannelE = base & {
	type: typeof ApplicationCommandOptionType.Channel
	value: typeof Snowflake.Encoded
}
type applicationCommandMentionableE = base & {
	type: typeof ApplicationCommandOptionType.Mentionable
	value: typeof Snowflake.Encoded
}
type applicationCommandRoleE = base & {
	type: typeof ApplicationCommandOptionType.Role
	value: typeof Snowflake.Encoded
}
type applicationCommandUserE = base & {
	type: typeof ApplicationCommandOptionType.User
	value: typeof Snowflake.Encoded
}

type applicationCommandSubcommandE = base & {
	type: typeof ApplicationCommandOptionType.Subcommand
	options: readonly applicationCommandE[]
}
type applicationCommandSubcommandGroupE = base & {
	type: typeof ApplicationCommandOptionType.SubcommandGroup
	options: readonly applicationCommandE[]
}

// https://github.com/Effect-TS/effect/issues/2874
type applicationCommandE =
	// Leaves
	| applicationCommandAttachmentE
	| ApplicationCommandBoolean
	| applicationCommandChannelE
	| ApplicationCommandInt
	| applicationCommandMentionableE
	| ApplicationCommandNumber
	| applicationCommandRoleE
	| ApplicationCommandString
	| applicationCommandUserE
	// Roots
	| applicationCommandSubcommandE
	| applicationCommandSubcommandGroupE

// Schemas get gnarly here because trees are mutually recursive. Typedefs enforce correctness.
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
