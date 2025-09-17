import { ActionOptions } from "./types.ts"

export const ShuffleOptions = () =>
	ActionOptions.toSorted(() => Math.random() - 0.5)
