import { S, Pipe } from "../Lib/pure.ts"

/** @see {@link https://discord.com/developers/docs/reference#snowflakes} */
export const Snowflake = Pipe(S.String, S.Brand("Snowflake"))
export type Snowflake = typeof Snowflake.Type

// https://discord.com/developers/docs/resources/guild#guild-object
export const Guild = S.Any// TODO

// partial emoji object	id, name, and animated
export const Emoji = S.Any// TODO

/** @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure} */
export const resolved = S.Any// TODO

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-component-interaction-response-structures
export const componentInteractionResponse = S.Any// TODO

// https://discord.com/developers/docs/resources/channel#channel-object
export const Channel = S.Any// TODO

// https://discord.com/developers/docs/resources/guild#guild-member-object
export const GuildMember = S.Any// TODO

// https://discord.com/developers/docs/resources/user#user-object
export const User = S.Any// TODO

// https://discord.com/developers/docs/resources/message#message-object
export const Message = S.Any// TODO

// https://discord.com/developers/docs/resources/entitlement#entitlement-object
export const Entitlement = S.Any// TODO
