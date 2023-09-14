export interface RouterOptions {
  prefix?: string
}
type RouteMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RouteHandler = (request: Request) => Response

interface Route {
  method: RouteMethods
  path: string
  handler: RouteHandler
}

export class Router {
  private readonly routes: Route[] = []

  public addRoute (method: RouteMethods, path: string, handler: (request: Request) => Response): void {
    this.routes.push({ method, path, handler })
  }

  public handle (request: Request): Response {
    const { pathname } = new URL(request.url)

    const route = this.routes.find(route => route.method === request.method && route.path === pathname)

    if (route !== undefined) return route.handler(request)

    return new Response('Not found', { status: 404 })
  }
}
