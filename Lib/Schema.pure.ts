import * as S from "./Schema.types.ts"
import { Either, pipe, Schema } from "effect"

export * from "./Schema.types.ts"

export const Validate = <A, I, R>(schema: S.Schema<A, I, R>, a: NoInfer<A>): A =>
	pipe(a, Schema.validateEither(schema), eitherGetOrThrow)

export const DecodeThrows = <O>(schema: S.Schema<O, any, never>) => (t: string): O =>
	pipe(JSON.parse(t), Schema.decodeUnknownEither(schema), eitherGetOrThrow)

const eitherGetOrThrow = <R, L>(e: Either.Either<R, L>): R => {
	switch (e._tag) {
		case "Left": throw new Error(JSON.stringify(e.left))
		case "Right": return e.right
	}}
