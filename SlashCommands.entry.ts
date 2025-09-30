import type { APIApplicationCommand } from "discord-api-types/v10"
import * as Http from "./Lib/http.ts"
import { COMMANDS } from "./Respawn_Window/Command.types.ts"
import { Config } from "./env.ts"

// This is calling the bulk overwrite endpoint
// https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
Http.PutIO(`applications/${Config.APP_ID}/commands`, COMMANDS)
	.then((commands: readonly APIApplicationCommand[]) => {
		commands.forEach(x => console.log("Registered: " + x.name, x.id, x.description))
	})
