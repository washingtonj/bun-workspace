import { type Server as BunServer } from 'bun'
import { Req } from './request'
import { Res } from './response'

export type Controller = (req: Req, res: Res) => Response | Promise<Response>
export type ErrorHandler = (error: any, res: Res) => Response | Promise<Response>

interface ServerOptions {
  logger?: boolean
  port?: number
  errorhandler?: ErrorHandler
}

export class Server {
  constructor (
    private readonly controller: Controller,
    private readonly options: ServerOptions = { logger: true, port: 3000 }) { }

  private logger (req: Req): void {
    const { method, pathname } = req
    console.log(`📡 [${method}]: ${pathname}`)
  }

  private async handler (request: Request): Promise<Response> {
    const req = new Req(request)

    if (this.options.logger === true) this.logger(req)

    try {
      return await this.controller(req, new Res())
      // eslint-disable-next-line @typescript-eslint/brace-style
    }

    catch (error: any) {
      if (this.options.errorhandler != null) {
        return await this.options.errorhandler(error, new Res())
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

    console.log(`🐰 Our services is in orbit at http://localhost:${server.port} 🚀`)

    return server
  }
}
