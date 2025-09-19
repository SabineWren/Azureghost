import type {
	APIApplicationCommandInteractionDataIntegerOption,
	APIApplicationCommandInteractionDataStringOption,
	APIMessageComponentInteraction,
	APIMessageSelectMenuInteractionData,
	APIModalSubmitInteraction,
} from "discord-api-types/v10"
import { verifyKeyMiddleware } from "discord-interactions"
import express, { type Response } from "express"
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionContextType,
	InteractionResponseType,
	Interaction,
	InteractionType,
} from "./Discord/types.ts"
import { HttpDelete } from "./Lib/http.ts"
import { Flow, Option, Pipe, S } from "./Lib/pure.ts"
import {
	HandleChallenge, HandleOptionAccept, HandleOptionSelect,
	ID_SEP, PREFIX_ACCEPT, PREFIX_SELECT,
} from "./RPS/handler.ts"
import { HandleKill } from "./Respawn_Window/handler.ts"
import { Config } from "./env.ts"

const router = express()

// User ID is in user field for (G)DMs, and member for servers.
const parseUserId = (interaction: Interaction.Interaction) => Pipe(
	interaction.context,
	Option.fromNullable,
	Option.flatMapNullable(context => context === InteractionContextType.Guild
		? interaction.member?.user
		: interaction.user,
	),
	Option.map(x => x.id),
)

// TODO schema decode?
// See Command.types.ts
const parseFirstCommandOption = (interaction: Interaction.ApplicationCommand) => Pipe(
	Option.some(interaction.data),
	Option.Filter(x => x.type === ApplicationCommandType.ChatInput),
	Option.flatMapNullable(x => x.options),
	Option.flatMapNullable(xs => xs[0]),
	Option.Filter(x => x.type === ApplicationCommandOptionType.String)
)

const parseCommandOption = (i: number, interaction: Interaction.ApplicationCommand) => Pipe(
	Option.some(interaction.data),
	Option.Filter(x => x.type === ApplicationCommandType.ChatInput),
	Option.flatMapNullable(x => x.options),
	Option.flatMapNullable(xs => xs[i]),
)
const parseCommandString = Flow(
	parseCommandOption,
	Option.Filter(x => x.type === ApplicationCommandOptionType.String),
)
const parseCommandInt = Flow(
	parseCommandOption,
	Option.Filter(x => x.type === ApplicationCommandOptionType.Integer),
)

const parseFirstSelectOption = (interaction: Interaction.MessageComponent) => Pipe(
	Option.some(interaction.data),
	Option.flatMapNullable(x => x.values),
	Option.flatMapNullable(xs => xs[0]),
)

const onCommand = (res: Response, interaction: Interaction.ApplicationCommand): Response => {
	switch (interaction.data.name) {
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
					res.send(HandleChallenge(
						interaction.id,
						userId,
						option as APIApplicationCommandInteractionDataStringOption,
					)),
			}),
		)
	case "kill":
		return Pipe(
			Option.Do,
			Option.bind("boss", () => parseCommandString(0, interaction)),
			Option.let("time", () => parseCommandInt(1, interaction)),
			Option.match({
				onNone: () => {
					if (interaction.data.type === ApplicationCommandType.ChatInput)
						console.log(interaction.data.options)
					else
						console.log("Invalid command type", interaction.data.type)
					console.error("Error validating command args", interaction.data.name)
					return res.status(400).json({ error: "Error validating command args" })
				},
				onSome: ({ boss, time }) =>
					res.send(HandleKill(
						boss as APIApplicationCommandInteractionDataStringOption,
						time as Option<APIApplicationCommandInteractionDataIntegerOption>,
					)),
			}),
		)
	default:
		console.error("unknown command", interaction.data.name)
		return res.status(400).json({ error: "unknown command" })
	}
}
const onCommandAutocomplete = (res: Response, interaction: Interaction.ApplicationCommandAutocomplete): Response =>
	res.status(400).json({ error: "unknown autocompletion" })

const onMessage = (res: Response, interaction: Interaction.MessageComponent): Response => {
	const messageId = interaction.message.id
	const [msgType, gameId] = interaction.data.custom_id.split(ID_SEP)
	const userId = parseUserId(interaction)
	const option = parseFirstSelectOption(interaction)

	if (!!gameId && msgType === PREFIX_ACCEPT) {
		console.log("Message Accept")
		void HttpDelete(`webhooks/${Config.APP_ID}/${interaction.token}/messages/${messageId}`)
		return res.send(HandleOptionAccept(gameId))
	}
	else if (!!gameId && msgType === PREFIX_SELECT && Option.isSome(userId) && Option.isSome(option)) {
		console.log("Message Select", option.value)
		void HttpDelete(`webhooks/${Config.APP_ID}/${interaction.token}/messages/${messageId}`)
		return res.send(HandleOptionSelect(gameId, userId.value, option.value))
	}
	else {
		console.error("Error validating message args", interaction.data)
		return res.status(400).json({ error: "Error validating message args" })
	}
}

const onModalSubmit = (res: Response, interaction: Interaction.ModalSubmit): Response =>
	res.status(400).json({ error: "unknown modal submit" })

router.post("/interactions", verifyKeyMiddleware(Config.PUBLIC_KEY), (req, res): Response => {
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

