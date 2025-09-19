import type { NonEmptyArray } from "./Array.pure.ts"
import type { Literal } from "./Util.d.ts"
import { Schema as S } from "effect"

export {
	Any,
	Array,
	Boolean,
	brand as Brand,
	clamp as Clamp,
	Int,
	length as Length,
	maxItems as MaxItems,
	maxLength as MaxLength,
	minItems as MinItems,
	minLength as MinLength,
	Literal,
	Number,
	Option,
	optional as Optional,
	Schema,
	String,
	Struct,
	suspend as Suspend,
	Union,
} from "effect/Schema"

export const Enum = <Key extends PropertyKey, V extends Literal>(
	pojo: { readonly [K in Key]: V },
	// Using S.Literal return type for EncodeDet compatibility.
	// It should otherwise be equivalent to S.Schema<literal, literal, never>
): S.Literal<NonEmptyArray<V>> =>
	S.Literal(...(Object.values(pojo) as NonEmptyArray<V>))
