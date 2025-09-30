import { Pipe } from "./pure.ts"
import { Config } from "../env.ts"

type method = "GET" | "DELETE" | "POST" | "PUT"

const request = <I>(
	method: method,
	endpoint: string,
	payload: I | null,
	accept: "json" | null,
): Promise<Response> => Pipe(
	"https://discord.com/api/v10/" + endpoint,
	url => {
		const options: RequestInit = {
			...(payload ? { body: JSON.stringify(payload) } : {}),
			cache: "no-cache",
			headers: {
				...(accept === "json" ? { Accept: "application/json" } : {}),
				"Authorization": `Bot ${Config.DISCORD_TOKEN}`,
				"Content-Type": "application/json charset=UTF-8",
				"User-Agent": "DiscordBot (https://github.com/SabineWren/Azureghost, 1.0.0)",
			},
			method: method,
		}
		return fetch(url, options)
	},
	resp => resp.then(async r => {
		if (!r.ok)
			throw new Error(Pipe(
				await r.json(),
				m => JSON.stringify(m),
				m => r.status.toFixed() + "; " + m,
			))
		else {
			console.log(method, r.status)
			return r
		}
	}),
)

const http = (m: method) => (url: string): Promise<void> =>
	request(m, url, null, null).then(r => void 0)

const httpI = (m: method) => <I>(url: string, i: I): Promise<void> =>
	request(m, url, i, null).then(r => void 0)

const httpO = (m: method) => <O>(url: string): Promise<O> =>
	request(m, url, null, "json").then(r => r.json() as Promise<O>)

const httpIO = (m: method) => <I, O=any>(url: string, i: I): Promise<O> =>
	request(m, url, i, "json").then(r => r.json() as Promise<O>)

export const Get = http("GET")
export const GetI = httpI("GET")
export const GetO = httpO("GET")
export const GetIO = httpIO("GET")

export const Put = http("PUT")
export const PutI = httpI("PUT")
export const PutO = httpO("PUT")
export const PutIO = httpIO("PUT")

export const Delete = http("DELETE")
export const DeleteI = httpI("DELETE")
export const DeleteO = httpO("DELETE")
export const DeleteIO = httpIO("DELETE")

export const Post = http("POST")
export const PostI = httpI("POST")
export const PostO = httpO("POST")
export const PostIO = httpIO("POST")
