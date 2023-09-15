import { Req } from 'data'
import type { Router } from './router'
import { type Server as BunServer } from 'bun'

interface ServerOptions {
  logger?: boolean
  port?: number
}

type RouterHandler = (req: Request) => Router

export class Server {
  constructor (private readonly router: RouterHandler, private readonly options?: ServerOptions) { }

  private logger (req: Req): void {
    const { method, pathname } = req

    // Print request to console colored the method and url
    console.log(`📡 [${method}]: ${pathname}`)
  }

  private async handler (request: Request): Promise<Response> {
    const req = new Req(request)

    if (this.options?.logger !== undefined) this.logger(req)

    return (await this.router(request).handle(req)).toResponse()
  }

  start (): BunServer {
    const server = Bun.serve({
      port: this.options?.port,
      fetch: this.handler.bind(this)
    })

    console.log(`Bun server in orbit at http://localhost:${server.port} 🚀`)

    return server
  }
}
