import { Res } from 'data'
import type { Req } from 'data'

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type RouteHandler = (request: Req) => Promise<Res>

export interface Route {
  method: HttpMethods
  handler: RouteHandler
  path: string
}

export interface RouterOpts {
  prefix?: string
}

export class Router {
  private readonly routes: Route[] = []
  public readonly prefix?: string

  constructor (options: RouterOpts = {}) {
    this.prefix = options.prefix
  }

  private handleWildcardRoute (route: Route, request: Req): boolean {
    const pathRegex = new RegExp(route.path.replace(/:[^/]+/g, '([^/]+)'))
    const match = request.pathname.match(pathRegex)

    if (match != null) {
      const params = route.path.match(/:[^/]+/g) ?? []

      params.forEach((param, index) => {
        const key = param.replace(':', '')
        const value = match[index + 1]
        request.params[key] = value
      })
    }

    return match !== null && route.method === request.method
  }

  public addRoute (method: HttpMethods, path: string, handler: RouteHandler): void {
    if (this.prefix !== undefined) path = `${this.prefix}${path}`
    this.routes.push({ method, path, handler })
  }

  public async handle (request: Req): Promise<Res> {
    const { method, pathname } = request

    const route = this.routes.find(route => {
      if (route.path.includes(':')) return this.handleWildcardRoute(route, request)
      return route.method === method && route.path === pathname
    })

    if (route !== undefined) return await route.handler(request)

    return new Res({ status: 404 })
  }
}
