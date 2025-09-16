import type { APIInteraction } from "discord-api-types/v10"
import { verifyKeyMiddleware } from "discord-interactions"
import express from "express"
import { Array, DateTime, Option, Pipe } from "./Lib/math.ts"
import { ComputeRespawnWindows } from "./Respawn_Window/math.ts"
import { BOSS_VANILLA, Kill, MONTH } from "./Respawn_Window/types.ts"
import { Config } from "./env.ts"
import { HandleChallenge, HandleTest } from "./Discord/handler.ts"
import { InteractionResponseType, InteractionType } from "./Discord/types.ts"

const router = express()

// Store for in-progress games. In production, you'd want to use a DB
const activeGames: Record<string, { id: string, objectName: any }> = {}

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

			// Interaction context
			const context = req.body.context
			// User ID is in user field for (G)DMs, and member for servers
			const userId: string = context === 0 ? req.body.member.user.id : req.body.user.id
			// User's object choice
			const objectName = req.body.data.options[0].value

			// Create active game using message ID as the game ID
			activeGames[interaction.id] = {
				id: userId,
				objectName,
			}

			return res.send(HandleChallenge(interaction, userId, req.body.id))
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
