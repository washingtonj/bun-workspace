import type { Router } from './router'
import { Server as BunServer } from 'bun'

interface ServerOptions extends Omit<BunServer, 'fetch'> {}

export class Server {
  constructor (private readonly router: Router, private readonly options?: ServerOptions) { }

  start (): BunServer {
    const server = Bun.serve({
      ...this.options,
      fetch: (request: Request) => this.router.handle(request),
    })

    console.log(`Bun server in orbit at http://localhost:${server.port} 🚀`)

    return server
  }
}
