import { Req } from 'data'
import type { Router } from './router'
import { type Server as BunServer } from 'bun'
import { type ErrorHandler } from 'utils/error-handler'

interface ServerOptions {
  logger?: boolean
  port?: number
  errorhandler?: ErrorHandler
}

type RouterHandler = (req: Request) => Router

export class Server {
  constructor (private readonly router: RouterHandler, private readonly options?: ServerOptions) { }

  private logger (req: Req): void {
    const { method, pathname } = req
    console.log(`📡 [${method}]: ${pathname}`)
  }

  private async handler (request: Request): Promise<Response> {
    const req = new Req(request)

    if (this.options?.logger !== true) this.logger(req)

    try {
      return (await this.router(request).handle(req)).toResponse()
      // eslint-disable-next-line @typescript-eslint/brace-style
    }

    catch (error: any) {
      if ((this.options?.errorhandler) != null) {
        return (await this.options.errorhandler(error)).toResponse()
      }

      return new Response(JSON.stringify({
        name: error.name,
        message: error.message
      }), { status: 500 })
    }
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
