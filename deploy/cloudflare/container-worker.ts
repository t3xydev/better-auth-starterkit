/**
 * Cloudflare Containers entry: proxies all HTTP traffic to the Next.js container.
 * Used when deployConfig.cloudflare.runtime === "containers".
 */
import { Container, getContainer } from "@cloudflare/containers"

export class AuthServerContainer extends Container {
	defaultPort = 3000
	sleepAfter = "10m"
}

export default {
	async fetch(
		request: Request,
		env: { AUTH_SERVER: DurableObjectNamespace },
	): Promise<Response> {
		const container = getContainer(env.AUTH_SERVER, "main")
		return container.fetch(request)
	},
}
