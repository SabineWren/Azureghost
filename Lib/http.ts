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

export const HttpGet = http("GET")
export const HttpGetI = httpI("GET")
export const HttpGetO = httpO("GET")
export const HttpGetIO = httpIO("GET")

export const HttpPut = http("PUT")
export const HttpPutI = httpI("PUT")
export const HttpPutO = httpO("PUT")
export const HttpPutIO = httpIO("PUT")

export const HttpDelete = http("DELETE")
export const HttpDeleteI = httpI("DELETE")
export const HttpDeleteO = httpO("DELETE")
export const HttpDeleteIO = httpIO("DELETE")

export const HttpPost = http("POST")
export const HttpPostI = httpI("POST")
export const HttpPostO = httpO("POST")
export const HttpPostIO = httpIO("POST")
