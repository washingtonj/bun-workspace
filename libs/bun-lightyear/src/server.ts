import type { Router } from './router'
import { Server as BunServer } from 'bun'

interface ServerOptions {
  port?: number
}

export class Server {
  constructor (private readonly router: Router, private readonly options?: ServerOptions) { }

  start (): BunServer {
    const server = Bun.serve({
      port: this.options?.port ?? 3000,
      fetch: (request: Request) => this.router.handle(request)
    })

    console.log(`Bun server in orbit at http://localhost:${server.port} 🚀`)

    return server
  }
}
