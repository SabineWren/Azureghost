import { S, Pipe } from "../Lib/pure.ts"
import { ApplicationCommandOptionType } from "./Enum.types.ts"

/** @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-interaction-data-option-structure} */
export const ApplicationCommand = S.Struct({
	name: S.String,
	type: S.Enum(ApplicationCommandOptionType),
	/** User input */
	value: S.Optional(S.Union(S.String, S.Int, S.Number, S.Boolean)),
	/** Present if this option is a group or subcommand */
	options: S.Optional(S.Array(
		S.Suspend((): S.Schema<ApplicationCommand> => ApplicationCommand),
	)),
	/** true if this option is the currently focused option for autocomplete */
	focused: S.Optional(S.Boolean),
})
export type ApplicationCommand = {
	name: string
	type: ApplicationCommandOptionType
	value?: undefined | string | number | boolean
	options?: undefined |  readonly ApplicationCommand[]
	focused?: undefined | boolean
}
