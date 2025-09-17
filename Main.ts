import type { APIInteraction } from "discord-api-types/v10"
import { verifyKeyMiddleware } from "discord-interactions"
import express from "express"
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionContextType,
	InteractionResponseType,
	InteractionType,
} from "./Discord/types.ts"
import { Option, Pipe } from "./Lib/pure.ts"
import { ComputeRespawnWindows } from "./Respawn_Window/pure.ts"
import { BOSS_VANILLA, Kill, MONTH } from "./Respawn_Window/types.ts"
import { HandleChallenge, HandleTest } from "./RPS/handler.ts"
import { Config } from "./env.ts"

const router = express()

router.post("/interactions", verifyKeyMiddleware(Config.PUBLIC_KEY), async (req, res) => {
	const interaction: APIInteraction = req.body

	switch (interaction.type) {
	// TODO does this ever run? It looks like pings skip this handler.
	// https://github.com/discord/discord-example-app/blob/main/app.js
	case InteractionType.PING:
		console.warn("Ping handler")
		return res.send({ type: InteractionResponseType.PONG })
	case InteractionType.APPLICATION_COMMAND: {
		switch (interaction.data.name) {
		case "test":
			return res.send(HandleTest(interaction))
		case "challenge":
			return Pipe(
				Option.Do,
				// User ID is in user field for (G)DMs, and member for servers.
				Option.bind("userId", () => Pipe(
					interaction.context,
					Option.fromNullable,
					Option.flatMapNullable(context => context === InteractionContextType.Guild
						? interaction.member?.user
						: interaction.user,
					),
					Option.map(x => x.id),
				)),
				// TODO schema decode?
				// User's object choice -- See Command.types.ts
				Option.bind("option", () => Pipe(
					Option.some(interaction.data),
					Option.Filter(x => x.type === ApplicationCommandType.ChatInput),
					Option.flatMapNullable(x => x.options),
					Option.flatMapNullable(xs => xs[0]),
					Option.Filter(x => x.type === ApplicationCommandOptionType.String)
				)),
				Option.match({
					onNone: () => {
						console.error("Error validating command args", interaction.data.name)
						return res.status(400).json({ error: "Error validating command args" })
					},
					onSome: ({ option, userId }) =>
						res.send(HandleChallenge(interaction.id, userId, option)),
				}),
			)
		default:
			console.error("unknown command", interaction.data.name)
			return res.status(400).json({ error: "unknown command" })
		}
	}
	default:
		console.error("unknown interaction type", interaction.type)
		return res.status(400).json({ error: "unknown interaction type" })
	}
})

const input: Kill[] = [
	{
		Boss: BOSS_VANILLA.Azuregos,
		At: Temporal.PlainDateTime.from({ year: 2025, month: MONTH.Jan, day: 1, hour: 14, minute: 5 }),
	},
]

const output = ComputeRespawnWindows(input)
const payload = {
	"username": "Boss Timers",
	"content": output,
}
// console.log(JSON.stringify(payload))

const PORT = 3000
router.listen(PORT, () => {
	console.log("Listening on port " + PORT, PORT)
});
