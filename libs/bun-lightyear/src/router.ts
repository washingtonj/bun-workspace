import { type Res } from './response'
import { type Req } from './request'
import { type WebSocket } from 'websocket'
import { type Controller } from './server'

type RouteMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
interface RouteRules { query?: string[], params?: string[], cookies?: string[] }
interface RouteWithRules { rules: (rules: RouteRules) => void }

interface Route {
  method: RouteMethods
  path: string
  rules?: RouteRules
  handler: Controller
}

interface RouterOptions {
  prefix?: string
}

export class Router {
  private readonly routes: Route[] = []

  constructor (private readonly options: RouterOptions = {}) { }

  public route (method: RouteMethods, path: string, handler: Controller): RouteWithRules {
    if (this.prefix !== undefined) path = `${this.prefix}${path}`
    this.routes.push({ method, path, handler })

    return {
      rules: (rules: RouteRules) => {
        this.rules(this.routes[this.routes.length - 1], rules)
      }
    }
  }

  public get prefix (): string | undefined {
    return this.options.prefix
  }

  public rules (route: Route, rules: RouteRules): void {
    route.rules = {}
    if (rules.query !== undefined) route.rules.query = rules.query
    if (rules.params !== undefined) route.rules.params = rules.params
    if (rules.cookies !== undefined) route.rules.cookies = rules.cookies
  }

  public handle (request: Req, response: Res, websocket: WebSocket): Response | Promise<Response> {
    const { method, pathname } = request

    const route = this.routes.find(route => {
      if (route.path.includes(':')) return this.handleWildcardRoute(route, request)
      return route.method === method && route.path === pathname
    })

    if (route !== undefined && !this.handleRules(route, request)) {
      return response.send({
        status: 400,
        body: {
          message: 'Missing required query or params',
          needed: route.rules,
          received: {
            query: request.query,
            params: request.params,
            cookies: request.cookies
          }
        }
      })
    }

    if (route !== undefined) {
      return route.handler(request, response, websocket)
    }

    return response.send({
      status: 404,
      body: {
        message: `Could not find a controller for ${method} ${pathname}`
      }
    })
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

    const { query, params, cookies } = route.rules

    if (query !== undefined) {
      const missingQueryParams = query.filter(param => request.query[param] === undefined)
      if (missingQueryParams.length > 0) return false
    }

    if (params !== undefined) {
      const missingParams = params.filter(param => request.params[param] === undefined)
      if (missingParams.length > 0) return false
    }

    if (cookies !== undefined) {
      const missingCookies = cookies.filter(cookie => request.cookies[cookie] === undefined)
      if (missingCookies.length > 0) return false
    }

    return true
  }
}
