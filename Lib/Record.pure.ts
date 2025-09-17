export const Keys = <R extends Record<PropertyKey, any>>(r: R): Array<keyof R> =>
	Object.keys(r)
