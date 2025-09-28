import { CurryRev } from "./Function.pure.ts"
import * as Option from "./Option.pure.ts"

export type Dict<K, V> = ReadonlyMap<K, V>
type Option<A> = Option.Option<A>

// -----------------------------------------------------------------------------
// Accessing / Querying
// -----------------------------------------------------------------------------

export const Get: {
	<K, V>(map: Dict<K, V>, k: K): Option<V>
	<K>(k: K): <V>(map: Dict<K, V>) => Option<V>
} = CurryRev(<K, V>(map: Dict<K, V>, k: K): Option<V> => Option.fromNullable(map.get(k)))

// -----------------------------------------------------------------------------
// ************ Conversions ************
// -----------------------------------------------------------------------------

export const Keys = <K, V>(map: Dict<K, V>): K[] => [...map.keys()]

export const Values = <K, V>(map: Dict<K, V>): V[] => [...map.values()]

// -----------------------------------------------------------------------------
// ************ Alterations ************
// -----------------------------------------------------------------------------

export const Alter_Mut: {
	<K, V>(map: Map<K, V>, k: K, f: (v: Option<V>) => Option<V>): void
	<K, V>(k: K, f: (v: Option<V>) => Option<V>): (map: Map<K, V>) => void
} = CurryRev(<K, V>(map: Map<K, V>, k: K, f: (v: Option<V>) => Option<V>) => {
	Option.match(f(Option.fromNullable(map.get(k))), {
		onSome: v => map.set(k, v),
		onNone: () => map.delete(k),
	})
})

export const Alter: {
	<K, V>(map: Dict<K, V>, k: K, f: (v: Option<Readonly<V>>) => Option<V>): Dict<K, V>
	<K, V>(k: K, f: (v: Option<Readonly<V>>) => Option<V>): (map: Dict<K, V>) => Dict<K, V>
} = CurryRev(<K, V>(map: Dict<K, V>, k: K, f: (v: Option<V>) => Option<V>) => {
	const mapCopy = new Map(map)
	Alter_Mut(mapCopy, k, f)
	return mapCopy
})

export const Set: {
	<K, V>(map: Dict<K, V>, k: K, v: V): Dict<K, V>
	<K, V>(k: K, v: V): (map: Dict<K, V>) => Dict<K, V>
} = CurryRev(<K, V>(map: Dict<K, V>, k: K, v: V): Dict<K, V> =>
	Alter(map, k, _ => Option.some(v)))
