/** Pojos behave way better than enums in TS.
@example
const SomeRecord = { a: 1, b: 2 }
type SomeRecord = ValuesOf<typeof SomeRecord>
// equivalent to
type SomeRecord = 1 | 2
*/
export type ValuesOf<T> = T[keyof T]

export type Comparable = bigint | boolean | number | string | symbol
export type Literal = bigint | boolean | number | null | string
export type Orderable = bigint | boolean | number | string

type WidenComparable<A extends Comparable> =
	A extends bigint ? bigint
	: A extends boolean ? boolean
	: A extends number ? number
	: A extends string ? string
	: A extends symbol ? symbol
	: never
