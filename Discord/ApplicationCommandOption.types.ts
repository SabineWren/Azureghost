import { S, Pipe } from "../Lib/pure.ts"
import { ApplicationCommandOptionType } from "./Enum.types.ts"
import { Channel as ChannelType, LocalizationMap } from "./Root.types.ts"

const choiceBase = S.Struct({
	name: Pipe(S.String, S.Length({ min: 1, max: 100 })),
	name_localizations: S.Optional(LocalizationMap),
})
export const ChoiceInt = S.Struct({
	...choiceBase.fields,
	value: S.Int,
})
export const ChoiceNumber = S.Struct({
	...choiceBase.fields,
	value: S.Number,
})
export const ChoiceString = S.Struct({
	...choiceBase.fields,
	value: Pipe(S.String, S.Length({ min: 0, max: 100 })),
})
export type ChoiceInt = typeof ChoiceInt.Type
export type ChoiceNumber = typeof ChoiceNumber.Type
export type ChoiceString = typeof ChoiceString.Type

const base = S.Struct({
	name: Pipe(S.LowercaseString, S.Length({ min: 1, max: 32 })),
	name_localizations: S.Optional(LocalizationMap),
	description: Pipe(S.String, S.Length({ min: 1, max: 100 })),
	description_localizations: S.Optional(LocalizationMap),
})

export const Attachment = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.Attachment),
	required: S.Boolean,
})
export const Boolean = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.Boolean),
	required: S.Boolean,
})
export const Channel = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.Channel),
	required: S.Boolean,
	channel_types: S.Optional(S.Array(ChannelType)),
})
export const Integer = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.Integer),
	required: S.Boolean,
	choices: S.Optional(Pipe(S.Array(ChoiceInt), S.MaxItems(25))),
	min_value: S.Optional(S.Int),
	max_value: S.Optional(S.Int),
	autocomplete: S.Optional(S.Boolean),
})
export const Mentionable = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.Mentionable),
	required: S.Boolean,
})
export const Number = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.Number),
	required: S.Boolean,
	choices: S.Optional(Pipe(S.Array(ChoiceNumber), S.MaxItems(25))),
	min_value: S.Optional(S.Number),
	max_value: S.Optional(S.Number),
	autocomplete: S.Optional(S.Boolean),
})
export const Role = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.Role),
	required: S.Boolean,
})
export const String = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.String),
	required: S.Boolean,
	choices: S.Optional(Pipe(S.Array(ChoiceString), S.MaxItems(25))),
	min_length: S.Optional(Pipe(S.Int, S.Clamp(0, 6000))),
	max_length: S.Optional(Pipe(S.Int, S.Clamp(1, 6000))),
	autocomplete: S.Optional(S.Boolean),
})
export const Subcommand = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.Subcommand),
	options: S.MaxItems(25)(S.Array(
		S.Suspend((): S.Schema<Union, Union, unknown> => Union),
	)),
})
export const SubcommandGroup = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.SubcommandGroup),
	options: S.MaxItems(25)(S.Array(
		S.Suspend((): S.Schema<Union, Union, unknown> => Union),
	)),
})
export const User = S.Struct({
	...base.fields,
	type: S.DefaultLiteral(ApplicationCommandOptionType.User),
	required: S.Boolean,
})

export const Union = S.Union(
	Attachment,
	Boolean,
	Channel,
	Integer,
	Mentionable,
	Number,
	Role,
	String,
	Subcommand,
	SubcommandGroup,
	User,
)

type base = typeof base.Type
export type Attachment = typeof Attachment.Type
export type Boolean = typeof Boolean.Type
export type Channel = typeof Channel.Type
export type Integer = typeof Integer.Type
export type Mentionable = typeof Mentionable.Type
export type Number = typeof Number.Type
export type Role = typeof Role.Type
export type String = typeof String.Type
export type Subcommand = base & {
	type: typeof ApplicationCommandOptionType.Subcommand
	options: readonly Union[]
}
export type SubcommandGroup = base & {
	type: typeof ApplicationCommandOptionType.SubcommandGroup
	options: readonly Union[]
}
export type User = typeof User.Type
export type Union =
	| Attachment
	| Boolean
	| Channel
	| Integer
	| Mentionable
	| Number
	| Role
	| String
	| Subcommand
	| SubcommandGroup
	| User
