import { S, Pipe } from "../Lib/pure.ts"
import { ApplicationCommandOptionType } from "./Enum.types.ts"
import { Emoji } from "./Root.types.ts"

export const SelectOption = S.Struct({
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

export const SelectOptionValue = S.Struct({
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

export type SelectOption = typeof SelectOption.Type
export type SelectOptionValue = typeof SelectOptionValue.Type
