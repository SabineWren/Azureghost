import { dual as Dual } from "effect/Function"
import { Option as EffectOption } from "effect"

export type Some<A> = EffectOption.Some<A>
export type None<A> = EffectOption.None<A>
export type Option<A> = None<A> | Some<A>

export {
	all,
	andThen,
	bind,
	Do,
	flatMap,
	flatMapNullable,
	flatten,
	fromNullable,
	getOrElse,
	getOrNull,
	getOrThrow,
	getOrThrowWith,
	isNone,
	isOption,
	isSome,
	let,
	lift2,
	liftNullable,
	map,
	match,
	orElse,
	none,
	some,
	zipWith,
} from "effect/Option"

export const Filter: {
	<A, B extends A>(pred: (a: A) => a is B): (self: Option<A>) => Option<B>
	<A>(pred: (a: A) => boolean): (self: Option<A>) => Option<A>
	<A, B extends A>(self: Option<A>, pred: (a: A) => a is B): Option<B>
	<A>(self: Option<A>, pred: (a: A) => boolean): Option<A>
} = Dual(
	2,
	<A, B extends A>(self: Option<A>, pred: (a: A) => a is B): Option<B> =>
		EffectOption.flatMap(
			self,
			v => pred(v) ? self as Option<B> : EffectOption.none(),
		),
)

export const FilterMap: {
	<A, B extends A, C>(pred: (a: A) => a is B, mapper: (b: B) => C): (self: Option<A>) => Option<C>
	<A, C>(pred: (a: A) => boolean, mapper: (b: A) => C): (self: Option<A>) => Option<C>
	<A, B extends A, C>(self: Option<A>, pred: (a: A) => a is B, mapper: (b: B) => C): Option<C>
	<A, C>(self: Option<A>, pred: (a: A) => boolean, mapper: (b: A) => C): Option<C>
} = Dual(
	3,
	<A, B extends A, C>(self: Option<A>, pred: (a: A) => a is B, mapper: (b: B) => C): Option<C> =>
		EffectOption.flatMap(
			self,
			v => pred(v) ? EffectOption.some(mapper(v)) : EffectOption.none(),
		),
)
