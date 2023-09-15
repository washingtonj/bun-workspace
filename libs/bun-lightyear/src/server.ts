import type { Router } from './router'
import { type Server as BunServer } from 'bun'

interface ServerOptions extends Omit<BunServer, 'fetch'> {}

export class Server {
  constructor (private readonly router: Router, private readonly options?: ServerOptions) { }

  start (): BunServer {
    const server = Bun.serve({
      ...this.options,
      fetch: async (request: Request) => await this.router.handle(request)
    })

    console.log(`Bun server in orbit at http://localhost:${server.port} 🚀`)

    return server
  }
}
