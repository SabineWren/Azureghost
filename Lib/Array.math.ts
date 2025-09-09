import { dual } from "effect/Function"

export * from "effect/Array"

export const SortBy: {
	<A, B>(xs: readonly A[], proj: (x: A) => B, cmp: (x: B, y: B) => -1 | 0 | 1): A[]
	<A, B>(proj: (x: A) => B, cmp: (x: B, y: B) => -1 | 0 | 1): (xs: readonly A[]) => A[]
} = dual(3, <A, B>(xs: readonly A[], proj: (x: A) => B, cmp: (x: B, y: B) => -1 | 0 | 1): A[] =>
	xs.toSorted((a, b) => cmp(proj(a), proj(b)))
)
