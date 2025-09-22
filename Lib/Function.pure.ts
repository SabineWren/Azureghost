export {
	flow as Flow,
	pipe as Pipe,
} from "effect"

/**
* Transforms a function parameterization into two call modes:
* 1. Unchanged.
* 2. Parameters rotated and then partially applied at the pivot point.
*/
export const CurryRev = <
	Original extends (...args: Array<any>) => any,
	Curried extends (...args: Array<any>) => any,
>(
	body: Original,
): Curried => {
	// @ts-expect-error
	return (...args1: any) => {
		if (args1.length >= body.length)
			return body(...args1)
		else
			// TODO performance
			return (...args2: any) => body(...args2.slice(0, Math.max(0, body.length - args1.length)), ...args1)
	}
}
