import { Record as EffectRecord } from "effect"
import type { NonEmptyArray } from "./Array.pure.ts"
import type { EmptyRecord, NotMap } from "./Record.types.ts"

export const Keys = <R extends Record<PropertyKey, any>>(r: R): Array<keyof R> =>
	Object.keys(r)

export const MapValues: {
	<Key extends PropertyKey, A, B>(self: { readonly [K in Key]: A }, f: (a: A, key: NoInfer<Key>) => B): Record<Key, B>
	<Key extends PropertyKey, A, B>(f: (a: A, key: NoInfer<Key>) => B): (self: { readonly [K in Key]: A }) => Record<Key, B>
} = EffectRecord.map

export const Values = <
	K extends PropertyKey,
	V,
	Rec extends Record<K, V>,
>(o: Record<K, V> & NotMap<Rec>) =>
	Object.values(o) as typeof o extends EmptyRecord ? never[] : NonEmptyArray<V>
