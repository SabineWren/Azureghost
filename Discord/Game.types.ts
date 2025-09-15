import { Array, Pipe, Record } from "../Lib/math.ts"

export type RuleName = "Computer" | "Cowboy" | "Paper" | "Rock" | "Scissors" | "Virus" | "Wumpus"
export type Rule = {
	Description: string
	Beats: Partial<Record<RuleName, string>>
}

export type PlayerAction = {
	id: any
	objectName: RuleName
}

export type GameResult = {
	win: PlayerAction
	lose: PlayerAction
	verb: string
}

export const RuleDetail: { [k in RuleName]: Rule } = {
	Computer: {
		Description: "beep boop beep bzzrrhggggg",
		Beats: {
			Cowboy: "overwhelms",
			Paper: "uninstalls firmware for",
			Wumpus: "deletes assets for",
		},
	},
	Cowboy: {
		Description: "yeehaw~",
		Beats: {
			Scissors: "puts away",
			Wumpus: "lassos",
			Rock: "steel-toe kicks",
		},
	},
	Paper: {
		Description: "versatile and iconic",
		Beats: {
			Virus: "ignores",
			Cowboy: "gives papercut to",
			Rock: "covers",
		},
	},
	Rock: {
		Description: "sedimentary, igneous, or perhaps even metamorphic",
		Beats: {
			Virus: "outwaits",
			Computer: "smashes",
			Scissors: "crushes",
		}
	},
	Scissors: {
		Description: "careful ! sharp ! edges !!",
		Beats: {
			Paper: "cuts",
			Computer: "cuts cord of",
			Virus: "cuts DNA of",
		},
	},
	Virus: {
		Description: "genetic mutation, malware, or something inbetween",
		Beats: {
			Cowboy: "infects",
			Computer: "corrupts",
			Wumpus: "infects",
		},
	},
	Wumpus: {
		Description: "the purple Discord fella",
		Beats: {
			Paper: "draws picture on",
			Rock: "paints cute face on",
			Scissors: "admires own reflection in",
		},
	},
}

export const ActionOptions = Pipe(
	Record.Keys(RuleDetail),
	// Formatted for select menus
	// https://discord.com/developers/docs/components/reference#string-select-select-option-structure
	Array.map(x => ({
		label: x,
		value: x.toLowerCase(),
		description: RuleDetail[x].Description,
	})),
)
