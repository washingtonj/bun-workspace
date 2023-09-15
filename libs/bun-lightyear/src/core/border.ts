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

  public connect (request: Request): Router {
    const path = new URL(request.url).pathname
    const prefix = `/${path.split('/')[1]}`

    if (this.routers.has(prefix)) {
      return this.routers.get(prefix) as Router
    }

    return this.routers.get('/') as Router
  }
}
