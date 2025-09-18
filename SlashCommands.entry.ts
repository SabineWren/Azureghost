import type { APIApplicationCommand } from "discord-api-types/v10"
import { HttpPutIO } from "./Lib/http.ts"
import { RPS_COMMANDS } from "./RPS/Command.types.ts"
import { COMMANDS } from "./Respawn_Window/Command.types.ts"
import { Config } from "./env.ts"

// This is calling the bulk overwrite endpoint
// https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
HttpPutIO(`applications/${Config.APP_ID}/commands`, RPS_COMMANDS.concat(COMMANDS))
	.then((commands: readonly APIApplicationCommand[]) => {
		commands.forEach(x => console.log("Registered: " + x.name, x.id, x.description))
	})
