import { Brand, Either, Schema } from "effect"
import { Flow, Pipe } from "./Function.pure.ts"
import * as S from "./Schema.types.ts"

export * from "./Schema.types.ts"

export const DecodeThrows = <O>(schema: S.Schema<O, any, never>) => (t: string): O =>
	Pipe(JSON.parse(t), Schema.decodeUnknownEither(schema), eitherGetOrThrow)

export const Encode = <I, IE>(schema: S.Schema<I, IE, never>): ((data: I) => string) =>
	Flow(Schema.encodeSync(schema, { propertyOrder: "none" }), JSON.stringify)

export const Validate = <A, I, R>(schema: S.Schema<A, I, R>, a: Brand.Brand.Unbranded<A>): A =>
	Pipe(a, Schema.validateEither(schema), eitherGetOrThrow)

const eitherGetOrThrow = <R, L>(e: Either.Either<R, L>): R => {
	switch (e._tag) {
		case "Left": throw new Error(JSON.stringify(e.left))
		case "Right": return e.right
	}}
