import { verifyKeyMiddleware } from "discord-interactions"
import express, { type Response } from "express"
import { GetCommandOptions, ParseCommandString, ParseUserId } from "./Discord/pure.ts"
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionContextType,
	InteractionResponseType,
	Interaction,
	InteractionType,
	InteractionDataOption,
} from "./Discord/types.ts"
import { Flow, Option, Pipe, S } from "./Lib/pure.ts"
import * as Handle from "./Respawn_Window/handler.ts"
import { Config } from "./env.ts"

import "./Respawn_Window/Reminder.handler.ts"

const router = express()

const parseFirstSelectOption = (interaction: Interaction.MessageComponent) => Pipe(
	Option.some(interaction.data),
	Option.flatMapNullable(x => x.values),
	Option.flatMapNullable(xs => xs[0]),
)

const onCommand = async (res: Response, interaction: Interaction.ApplicationCommand): Promise<Response> => {
	switch (interaction.data.name) {
	case "clear":
		return Handle.Clear(interaction).then(x => res.send(x))
	case "emoji":
		return Handle.Emoji(interaction).then(x => res.send(x))
	case "kill":
		return Handle.Kill(interaction).then(x => res.send(x))
	case "timezone":
		return Handle.TimeZone(interaction).then(x => res.send(x))
	default:
		console.error("unknown command", interaction.data.name)
		return res.status(400).json({ error: "unknown command" })
	}
}
const onCommandAutocomplete = (res: Response, interaction: Interaction.ApplicationCommandAutocomplete): Response =>
	res.status(400).json({ error: "unknown autocompletion" })

const onMessage = (res: Response, interaction: Interaction.MessageComponent): Response => {
	const messageId = interaction.message.id
	// interaction.data.custom_id
	const userId = ParseUserId(interaction)
	const option = parseFirstSelectOption(interaction)
	// void HttpDelete(`webhooks/${Config.APP_ID}/${interaction.token}/messages/${messageId}`)
	return res.status(400).json({ error: "Message handlers not implemented" })
}

const onModalSubmit = (res: Response, interaction: Interaction.ModalSubmit): Response =>
	res.status(400).json({ error: "unknown modal submit" })

router.post("/interactions", verifyKeyMiddleware(Config.PUBLIC_KEY), async (req, res): Promise<Response> => {
	const interaction = S.Validate(Interaction.Interaction, req.body)

	switch (interaction.type) {
	case InteractionType.PING:
		// Authentication short-circuits on pings
		// https://github.com/discord/discord-interactions-js/blob/main/src/index.ts
		console.error("Unexpected ping", JSON.stringify(interaction))
		return res.send({ type: InteractionResponseType.PONG })
	case InteractionType.APPLICATION_COMMAND:
		return onCommand(res, interaction)
	case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
		return onCommandAutocomplete(res, interaction)
	case InteractionType.MESSAGE_COMPONENT:
		return onMessage(res, interaction)
	case InteractionType.MODAL_SUBMIT:
		return onModalSubmit(res, interaction)
	default:
		interaction satisfies never
		console.error("unknown interaction type", (interaction as Interaction.Interaction).type)
		return res.status(400).json({ error: "unknown interaction type" })
	}
})

const PORT = 3000
router.listen(PORT, () => {
	console.log("Listening on port " + PORT, PORT)
});
