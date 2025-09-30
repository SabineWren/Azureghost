// Constructors
export const Empty = <A>(): Set<A> =>
	new Set<A>()

export const From = <A>(xs: Iterable<A>): Set<A> =>
	new Set(xs)

// Alterations
export const Add = <A>(s: ReadonlySet<A>, v: A): Set<A> => {
	const copy = new Set(s)
	copy.add(v)
	return copy
}

export const Remove = <A>(s: ReadonlySet<A>, v: A): Set<A> => {
	const copy = new Set(s)
	copy.delete(v)
	return copy
}
