import "dotenv/config"
import { Option, Pipe } from "./Lib/math.ts"

export const Config = Pipe(
	Option.Do,
	Option.bind("APP_ID", () => Option.fromNullable(process.env["APP_ID"])),
	Option.bind("DISCORD_TOKEN", () => Option.fromNullable(process.env["DISCORD_TOKEN"])),
	Option.bind("PUBLIC_KEY", () => Option.fromNullable(process.env["PUBLIC_KEY"])),
	Option.getOrThrowWith(() => new Error("Missing environment variable.")),
)
