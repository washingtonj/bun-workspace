import { type Server as BunServer, type WebSocketHandler } from 'bun'
import { BunSpeech } from 'bun-speech'
import { Req } from './request'
import { Res } from './response'
import { WebSocket } from './websocket'

/**
 * A controller is a function that handles requests and responses.
 */
export type Controller = (req: Req, res: Res, ws: WebSocket) => Response | Promise<Response>

/**
 * A error handler is a function that handles errors.
 */
export type ErrorHandler = (error: any, res: Res) => Response | Promise<Response>

interface ServerOptions {
  logger?: boolean
  port?: number
  errorhandler?: ErrorHandler
  cors?: {
    origin: string[]
    methods?: string[]
    credentials?: boolean
  }
}

/**
 * A Web server powered by Bun.
 */
export class Server {
  constructor (
    /**
     * The controller used to handle requests and responses
     * You can use a router instance here to handle multiple routes.
     */
    private readonly controller: Controller,
    /**
     * Options to be used in the server instance
     */
    private readonly options: ServerOptions = {},
    /**
     * A websocket handler to be used in the server instance
     */
    private readonly websocket: WebSocketHandler = { message: () => { } }
  ) { }

  private handleCors (req: Req, res: Res): void {
    if (this.options.cors != null) {
      const origin = req.headers.origin

      if (origin != null && this.options.cors.origin.includes(origin)) {
        res.headers['Access-Control-Allow-Origin'] = origin
      }

      res.headers['Access-Control-Allow-Methods'] = this.options.cors.methods?.join(', ') ?? 'GET, POST, PUT, DELETE, OPTIONS'
      res.headers['Access-Control-Allow-Credentials'] = String(this.options.cors.credentials ?? true)
    }
  }

  private async handler (request: Request, server: BunServer): Promise<Response | undefined> {
    const req = new Req(request)
    const res = new Res()
    const ws = new WebSocket(server, request)

    this.handleCors(req, res)

    const t1 = performance.now()

    try {
      return await this.controller(req, res, ws)
      // eslint-disable-next-line @typescript-eslint/brace-style
    }

    catch (error: any) {
      if (this.options.errorhandler != null) {
        return await this.options.errorhandler(error, res)
      }

      return new Response(JSON.stringify({
        name: error.name,
        message: error.message
      }), { status: 500 })
      // eslint-disable-next-line @typescript-eslint/brace-style
    }

    finally {
      // get the time after the request is done in ms
      const t2 = performance.now()
      const requestTime = (t2 - t1).toFixed(2)

      if (this.options.logger != null) {
        console.log(`📡  [${req.method}]: ${req.pathname} in ${requestTime}`)
      }
    }
  }

  start (): BunServer {
    const server = Bun.serve({
      port: this.options?.port,
      fetch: this.handler.bind(this),
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      websocket: this.websocket
    })

    BunSpeech.presentation('Bun Lightyear', 'An API should be fast, like a habbit.')
    BunSpeech.info(`Server is running on port ${this.options?.port}`)
    console.log('\n')

    return server
  }
}
