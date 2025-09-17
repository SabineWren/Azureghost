import type {
	APIInteraction,
	APIApplicationCommandInteraction,
	APIMessageComponentInteraction,
	APIMessageSelectMenuInteractionData,
} from "discord-api-types/v10"
import { verifyKeyMiddleware } from "discord-interactions"
import express from "express"
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionContextType,
	InteractionResponseType,
	InteractionType,
} from "./Discord/types.ts"
import { HttpDelete } from "./Lib/http.ts"
import { Option, Pipe } from "./Lib/pure.ts"
import { ComputeRespawnWindows } from "./Respawn_Window/pure.ts"
import { BOSS_VANILLA, Kill, MONTH } from "./Respawn_Window/types.ts"
import {
	ID_SEP, PREFIX_ACCEPT, PREFIX_SELECT,
	HandleChallenge, HandleOptionAccept, HandleOptionSelect, HandleTest,
} from "./RPS/handler.ts"
import { Config } from "./env.ts"

const router = express()

// User ID is in user field for (G)DMs, and member for servers.
const parseUserId = (interaction: APIInteraction) => Pipe(
	interaction.context,
	Option.fromNullable,
	Option.flatMapNullable(context => context === InteractionContextType.Guild
		? interaction.member?.user
		: interaction.user,
	),
	Option.map(x => x.id),
)

// TODO schema decode?
// User's object choice -- See Command.types.ts
const parseFirstCommandOption = (interaction: APIApplicationCommandInteraction) => Pipe(
	Option.some(interaction.data),
	Option.Filter(x => x.type === ApplicationCommandType.ChatInput),
	Option.flatMapNullable(x => x.options),
	Option.flatMapNullable(xs => xs[0]),
	Option.Filter(x => x.type === ApplicationCommandOptionType.String)
)

const parseFirstSelectOption = (interaction: APIMessageComponentInteraction) => Pipe(
	Option.some(interaction.data as APIMessageSelectMenuInteractionData),
	Option.flatMapNullable(x => x.values),
	Option.flatMapNullable(xs => xs[0]),
)

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
				Option.bind("userId", () => parseUserId(interaction)),
				Option.bind("option", () => parseFirstCommandOption(interaction)),
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
	case InteractionType.MESSAGE_COMPONENT: {
		const messageId = interaction.message.id
		const [msgType, gameId] = interaction.data.custom_id.split(ID_SEP)
		const userId = parseUserId(interaction)
		const option = parseFirstSelectOption(interaction)

		if (!!gameId && msgType === PREFIX_ACCEPT) {
			await res.send(HandleOptionAccept(gameId))
			await HttpDelete(`webhooks/${Config.APP_ID}/${interaction.token}/messages/${messageId}`)
			console.log("Message Accept")
			return
		}
		else if (!!gameId && msgType === PREFIX_SELECT && Option.isSome(userId) && Option.isSome(option)) {
			await res.send(HandleOptionSelect(gameId, userId.value, option.value))
			await HttpDelete(`webhooks/${Config.APP_ID}/${interaction.token}/messages/${messageId}`)
			console.log("Message Select", userId.value, option.value)
			return
		}
		else {
			console.error("Error validating message args", interaction.data)
			return res.status(400).json({ error: "Error validating message args" })
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
