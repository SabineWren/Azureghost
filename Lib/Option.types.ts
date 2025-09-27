import { Option as EffectOption } from "effect"

export type Some<A> = EffectOption.Some<A>
export type None<A> = EffectOption.None<A>
export type Option<A> = None<A> | Some<A>
