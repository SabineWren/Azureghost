import { type GameResult, type PlayerAction, RuleDetail } from "./types.ts"

export const DecideOutcome = (p1: PlayerAction, p2: PlayerAction): string => {
	console.log("p1", p1)
	console.log("p2", p2)
	const p1Win = RuleDetail[p1.objectName].Beats[p2.objectName]
	const p2Win = RuleDetail[p2.objectName].Beats[p1.objectName]
	const gameResult: GameResult =
		p1Win ? { win: p1, lose: p2, verb: p1Win }
		: p2Win ? { win: p2, lose: p1, verb: p2Win }
		: { win: p1, lose: p2, verb: "tie" }
	return formatResult(gameResult)
}

const formatResult = (result: GameResult): string => {
	const { win, lose, verb } = result
	return verb === "tie"
		? `<@${win.id}> and <@${lose.id}> draw with **${win.objectName}**`
		: `<@${win.id}>"s **${win.objectName}** ${verb} <@${lose.id}>"s **${lose.objectName}**`
}
