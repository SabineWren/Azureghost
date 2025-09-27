import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionContextType,
	Interaction,
	InteractionDataOption,
} from "./types.ts"
import { Array, Flow, Option, Pipe } from "../Lib/pure.ts"

/** User ID is in user field for (G)DMs, and member for servers. */
export const ParseUserId = (interaction: Interaction.Interaction) => Pipe(
	interaction.context,
	Option.fromNullable,
	Option.flatMapNullable(context => context === InteractionContextType.Guild
		? interaction.member?.user
		: interaction.user,
	),
	Option.map(x => x.id),
)

export const GetCommandOptions = (
	interaction: Interaction.ApplicationCommand,
): readonly InteractionDataOption.ApplicationCommand[] => Pipe(
	Option.some(interaction.data),
	Option.Filter(x => x.type === ApplicationCommandType.ChatInput),
	Option.flatMapNullable(x => x.options),
	Option.getOrElse(() => []),
)

const parseCommandOption = (
	i: number,
	interaction: Interaction.ApplicationCommand,
): Option<InteractionDataOption.ApplicationCommand> => Pipe(
	GetCommandOptions(interaction),
	Array.get(i),
)

export const ParseCommandString:
	(i: number, interaction: Interaction.ApplicationCommand) => Option<InteractionDataOption.ApplicationCommandString>
	= Flow(parseCommandOption, Option.Filter(x => x.type === ApplicationCommandOptionType.String))
export const ParseCommandInt:
	(i: number, interaction: Interaction.ApplicationCommand) => Option<InteractionDataOption.ApplicationCommandInt>
	= Flow(parseCommandOption, Option.Filter(x => x.type === ApplicationCommandOptionType.Integer))
