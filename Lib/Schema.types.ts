import type { NonEmptyArray } from "./Array.pure.ts"
import type { Literal } from "./Util.d.ts"
import * as S from "effect/Schema"

export {
	Any,
	Array,
	Boolean,
	brand as Brand,
	clamp as Clamp,
	declare as Declare,
	filter as Filter,
	Int,
	length as Length,
	maxItems as MaxItems,
	maxLength as MaxLength,
	minItems as MinItems,
	minLength as MinLength,
	Literal,
	Number,
	omit as Omit,
	Option,
	optional as Optional,
	type Schema,
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
