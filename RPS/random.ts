import { Array, Pipe, Record } from "../Lib/pure.ts"
import { RuleDetail } from "./types.ts"

const options = Pipe(
	Record.Keys(RuleDetail),
	// Formatted for select menus
	// https://discord.com/developers/docs/components/reference#string-select-select-option-structure
	Array.map(x => ({
		label: x,
		value: x,
		description: RuleDetail[x].Description,
	})),
)

export const ShuffleOptions = () =>
	options.toSorted(() => Math.random() - 0.5)
