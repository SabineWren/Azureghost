import { dual } from "effect/Function"
import { CurryRev, Pipe } from "./Function.pure.ts"
import type { Option } from "./Option.types.ts"
import type { Comparable, WidenComparable } from "./Util.d.ts"

export * from "effect/Array"

export const Choose: {
	<A, B>(chooser: (x: A, i: number) => Option<B>): (xs: Iterable<A>) => B[]
	<A, B>(xs: Iterable<A>, chooser: (x: A, i: number) => Option<B>): B[]
} = CurryRev(<A, B>(xs: Iterable<A>, chooser: (x: A, i: number) => Option<B>): B[] => {
	const zs: B[] = []
	let i = 0
	for (const x of xs) {
		const y = chooser(x, i)
		if (y._tag === "Some") zs.push(y.value)
		i++
	}
	return zs
})
// Pipe(EffectArray.map(xs, chooser), EffectArray.getSomes)

export const FilterMap: {
	<A, B extends A, C>(pred: (x: A, i: number) => x is B, f: (x: B, i: number) => C): (xs: readonly A[]) => C[]
	<A, C>(pred: (x: A, i: number) => boolean, f: (x: A, i: number) => C): (xs: readonly A[]) => C[]
	<A, B extends A, C>(xs: readonly A[], pred: (x: A, i: number) => x is B, f: (x: B, i: number) => C): C[]
	<A, C>(xs: readonly A[], pred: (x: A, i: number) => boolean, f: (x: A, i: number) => C): C[]
} = CurryRev(
	<A, C>(
		xs: readonly A[],
		pred: (x: A, i: number) => boolean,
		f: (x: A, i: number) => C,
	): C[] => {
		const ys: C[] = []
		for (let i = 0; i < xs.length; i++) {
			const x = xs[i]!
			if (pred(x, i)) ys.push(f(x, i))
		}
		return ys
	}
)

export const Includes = <A extends Comparable, B extends Comparable>(
	xs: readonly A[] & readonly WidenComparable<A>[] & readonly WidenComparable<B>[],
	y: B & WidenComparable<A> & WidenComparable<B>,
): boolean =>
	xs.includes(y)

export const Partition = <T>(xs: readonly T[], pred: (x: T, i: number) => boolean): [T[], T[]] => [
	xs.filter((x, i) => pred(x, i)),
	xs.filter((x, i) => !pred(x, i)),
]

export const SortBy: {
	<A, B>(xs: readonly A[], proj: (x: A) => B, cmp: (x: B, y: B) => -1 | 0 | 1): A[]
	<A, B>(proj: (x: A) => B, cmp: (x: B, y: B) => -1 | 0 | 1): (xs: readonly A[]) => A[]
} = dual(3, <A, B>(xs: readonly A[], proj: (x: A) => B, cmp: (x: B, y: B) => -1 | 0 | 1): A[] =>
	xs.toSorted((a, b) => cmp(proj(a), proj(b)))
)
