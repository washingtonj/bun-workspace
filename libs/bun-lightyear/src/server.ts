import { type Server as BunServer } from 'bun'
import { BunSpeech } from 'bun-speech'
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
    private readonly options: ServerOptions = {}) { }

  private logger (req: Req, requestTime: string): void {
    const { method, pathname } = req
    console.log(`📡  [${method}]: ${pathname} in ${requestTime}`)
  }

  private async handler (request: Request): Promise<Response> {
    const req = new Req(request)

    const t1 = performance.now()

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
      // eslint-disable-next-line @typescript-eslint/brace-style
    }

    finally {
      // get the time after the request is done in ms
      const t2 = performance.now()
      const requestTime = (t2 - t1).toFixed(2)

      if (this.options.logger !== false) this.logger(req, requestTime.toString().concat('ms'))
    }
  }

  start (): BunServer {
    const server = Bun.serve({
      port: this.options?.port,
      fetch: this.handler.bind(this)
    })

    BunSpeech.presentation('Bun Lightyear', 'An API should be fast, like a habbit.')
    BunSpeech.info(`Server is running on port ${this.options?.port}`)
    console.log('\n')

    return server
  }
}
