import { Res } from 'data'
import type { Req } from 'data'

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type RouteHandler = (request: Req) => Promise<Res>

export interface RouteRules { query?: string[], params?: string[] }
export interface RouteWithRules {
  addRules: (rules: RouteRules) => void
}

export interface Route {
  method: HttpMethods
  path: string
  rules?: RouteRules
  handler: RouteHandler
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

  private handleRules (route: Route, request: Req): boolean {
    if (route.rules === undefined) return true

    const { query, params } = route.rules

    if (query !== undefined) {
      const missingQueryParams = query.filter(param => request.query[param] === undefined)
      if (missingQueryParams.length > 0) return false
    }

    if (params !== undefined) {
      const missingParams = params.filter(param => request.params[param] === undefined)
      if (missingParams.length > 0) return false
    }

    return true
  }

  public addRules (route: Route, rules: RouteRules): void {
    route.rules = {}
    if (rules.query !== undefined) route.rules.query = rules.query
    if (rules.params !== undefined) route.rules.params = rules.params
  }

  public addRoute (method: HttpMethods, path: string, handler: RouteHandler): RouteWithRules {
    if (this.prefix !== undefined) path = `${this.prefix}${path}`
    this.routes.push({ method, path, handler })

    return {
      addRules: (rules: RouteRules) => {
        this.addRules(this.routes[this.routes.length - 1], rules)
      }
    }
  }

  public async handle (request: Req): Promise<Res> {
    const { method, pathname } = request

    const route = this.routes.find(route => {
      if (route.path.includes(':')) return this.handleWildcardRoute(route, request)
      return route.method === method && route.path === pathname
    })

    if (route !== undefined && !this.handleRules(route, request)) {
      return new Res({
        status: 400,
        body: {
          message: 'Missing required query or params',
          needed: route.rules,
          received: {
            query: request.query,
            params: request.params
          }
        }
      })
    }

    if (route !== undefined) return await route.handler(request)

    return new Res({ status: 404 })
  }
}
