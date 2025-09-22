import { S, Pipe, type ValuesOf } from "../Lib/pure.ts"

/** @see {@link https://discord.com/developers/docs/reference#snowflakes} */
export const Snowflake = Pipe(S.String, S.Brand("Snowflake"))
export type Snowflake = typeof Snowflake.Type

// https://discord.com/developers/docs/resources/guild#guild-object
export const Guild = S.Any// TODO

export const GuildId = Pipe(Snowflake, S.Brand("GuildId"))
export type GuildId = typeof GuildId.Type

// partial emoji object	id, name, and animated
export const Emoji = S.Any// TODO

/** @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure} */
export const resolved = S.Any// TODO

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-component-interaction-response-structures
export const componentInteractionResponse = S.Any// TODO

// https://discord.com/developers/docs/resources/channel#channel-object
export const Channel = S.Any// TODO
export type Channel = typeof Channel.Type

// https://discord.com/developers/docs/resources/guild#guild-member-object
export const GuildMember = S.Any// TODO

// https://discord.com/developers/docs/resources/user#user-object
export const User = S.Any// TODO

// https://discord.com/developers/docs/resources/message#message-object
export const Message = S.Any// TODO

// https://discord.com/developers/docs/resources/entitlement#entitlement-object
export const Entitlement = S.Any// TODO

/** @see {@link https://discord.com/developers/docs/reference#locales} */
export const Locale = {
	Indonesian: "id",
	EnglishUS: "en-US",
	EnglishGB: "en-GB",
	Bulgarian: "bg",
	ChineseCN: "zh-CN",
	ChineseTW: "zh-TW",
	Croatian: "hr",
	Czech: "cs",
	Danish: "da",
	Dutch: "nl",
	Finnish: "fi",
	French: "fr",
	German: "de",
	Greek: "el",
	Hindi: "hi",
	Hungarian: "hu",
	Italian: "it",
	Japanese: "ja",
	Korean: "ko",
	Lithuanian: "lt",
	Norwegian: "no",
	Polish: "pl",
	PortugueseBR: "pt-BR",
	Romanian: "ro",
	Russian: "ru",
	SpanishES: "es-ES",
	SpanishLATAM: "es-419",
	Swedish: "sv-SE",
	Thai: "th",
	Turkish: "tr",
	Ukrainian: "uk",
	Vietnamese: "vi"
} as const
export type Locale = ValuesOf<typeof Locale>

export const LocalizationMap = S.Partial(S.Record({
	key: S.Enum(Locale),
	value: S.NullOr(S.String)
}))
export type LocalizationMap = typeof LocalizationMap.Type
