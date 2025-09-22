import type { NonEmptyArray } from "./Array.pure.ts"
import { Flow, Pipe } from "./Function.pure.ts"
import type { Literal } from "./Util.d.ts"
import * as S from "effect/Schema"

export type AnySchema = S.Schema.AnyNoContext

export const DefaultLazy = <S extends AnySchema>(d: () => S.Schema.Type<S>) => Flow(
	S.propertySignature<S>,
	S.withConstructorDefault(d),
)
export const Default = <S extends AnySchema>(d: S.Schema.Type<S>) =>
	DefaultLazy(() => d)

export const DefaultLiteral = <T extends Literal>(t: T) => Pipe(
	S.Literal(t),
	Default(t),
)

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
	lowercased as Lowercase,
	Lowercased as LowercaseString,
	NullOr,
	Number,
	omit as Omit,
	Option,
	optional as Optional,
	partial as Partial,
	Record,
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
