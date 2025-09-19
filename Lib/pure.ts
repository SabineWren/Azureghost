export * as Array from "./Array.pure.ts"
export * from "./Combinators.pure.ts"
export * as DateTime from "./DateTime.pure.ts"

// Re-export aliases the entire module to "Option",
// but we want to expose the type "Option" without requiring namespace "Option.Option".
// This hack works because local types can share the name of variables or modules.
export * as Option from "./Option.pure.ts"
import type { Option as optionT } from "./Option.pure.ts"
export type Option<A> = optionT<A>

export * as Record from "./Record.pure.ts"
export * as S from "./Schema.types.ts"

export {
	flow as Flow,
	pipe as Pipe,
} from "effect"


export const CopyWith = <A>(a: A, changes: Partial<A>): A => ({
	...a,
	...changes,
})
