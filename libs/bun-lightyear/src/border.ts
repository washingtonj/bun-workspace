import { type Req } from 'request'
import { type Res } from 'response'
import { type WebSocket } from 'websocket'
import type { Router } from './router'

export class Border {
  private readonly routers = new Map<string, Router>()

  constructor (routers: Router[]) {
    for (const router of routers) {
      if (router.prefix !== undefined) {
        this.routers.set(router.prefix, router)
      }

      this.routers.set('/', router)
    }
  }

  public connect (request: Req, response: Res, websocket: WebSocket): Response | Promise<Response> {
    const path = new URL(request.url).pathname
    const prefix = `/${path.split('/')[1]}`

    const router = this.routers.get(prefix)

    if (router === undefined) {
      return response.send({
        status: 404,
        body: {
          message: `Could not find a router for ${path}`
        }
      })
    }

    return router.handle(request, response, websocket)
  }
}
