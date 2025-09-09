/**
 * @yields f(g(x), h(x))
 * @param x Argument for both unary functions
 * @param g First function called on x
 * @param h Second function called on x
 * @param f Binary function called on results
 * @description Φ, Phi, Phoenix, Converge, LiftA2, S2, S'
 */
export const Φ = <A, B, C, D>(x: A, g: (a: A) => B, h: (a: A) => C, f: (b: B, c: C) => D): D =>
	f(g(x), h(x))

/**
 * @yields f(g(x), g(y))
 * @param x input to g first call
 * @param y input to g second call
 * @param g Unary function called on both inputs
 * @param f Binary function called on result
 * @description Ψ, Psi, Over (APL, BQN), on (Haskell)
 */
export const Ψ = <A, B, C>
	(g: (a: A) => B, f: (b1: B, b2: B) => C) =>
	(x: A, y: A): C =>
		f(g(x), g(y))

export const S = <A, B, C>(x: A, g: (a: A) => B, f: (a: A, b: B) => C): C =>
	f(x, g(x))
