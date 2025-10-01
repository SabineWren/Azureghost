import * as Db from "./db.ts"
import * as Http from "../Lib/http.ts"
import { Dict, Option } from "../Lib/pure.ts"
import { BOSS } from "./types.ts"

setInterval(async () => {
	const now = Temporal.Now.zonedDateTimeISO().epochMilliseconds
	for (const [g, s] of await Db.AppGet()) {
		if (Option.isNone(s.ChannelAnnounce)) continue
		const channelId = s.ChannelAnnounce.value
		await Promise.all(
			s.DeathTime.entries()
				.filter(([n, t]) => !s.Announced.has(n) && BOSS.has(n))
				.map(([n, t]) => [n, BOSS.get(n)!, t] as const)
				.filter(([n, b, t]) => t.add(b.Respawn.Delay).epochMilliseconds < now)
				.map(async ([n, b, t]) => {
					const emoji = Dict.GetOr(s.CustomEmoji, n, b.Emoji)
					const msg = {
						content: `${emoji} ${b.Name} window open`,
					}
					await Http.PostI(`channels/${channelId}/messages`, msg)
					await Db.NotifySet(g, n)
				})
		)
	}
}, 10_000)
