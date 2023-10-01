import { type Res } from './response'
import { type Req } from './request'
import { type WebSocket } from 'websocket'
import { type Controller } from './server'

type RouteMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RouteRules { query?: string[], params?: string[], cookies?: string[] }

interface RouteWithRules { rules: (rules: RouteRules) => void }

interface Route {
  /**
   * The HTTP method to be used in the route
   */
  method: RouteMethods

  /**
   * The path to be used in the route
   */
  path: string

  /**
   * Rules used to validate the request before calling the controller
   */
  rules?: RouteRules

  /**
   * The controller to be used in the route
   */
  handler: Controller
}

interface RouterOptions {
  /**
   * A prefix to be used in all routes ingress
   */
  prefix?: string
}

/**
 * Create a router to handle requests and responses in a more organized way.
 *
 * @example
 * const router = new Router()
 *
 * router.route('GET', '/hello', (req, res) => {
 *  res.send({ status: 200, body: { message: 'Hello World!' } })
 * })
 */
export class Router {
  private readonly routes: Route[] = []

  constructor (private readonly options: RouterOptions = {}) { }

  /**
   * Register a new route inside the router instance
   * @param method The HTTP method to be used in the route
   * @param path The path to be used in the route
   * @param handler The controller to be used in the route
   */
  public route (method: RouteMethods, path: string, handler: Controller): RouteWithRules {
    if (this.prefix !== undefined) path = `${this.prefix}${path}`
    this.routes.push({ method, path, handler })

    return {
      rules: (rules: RouteRules) => {
        this.rules(this.routes[this.routes.length - 1], rules)
      }
    }
  }

  /**
   * Get the prefix used in all routes ingress
   */
  public get prefix (): string | undefined {
    return this.options.prefix
  }

  /**
   * Set the rules to validate the request before calling the controller
   * Here you can define which query, params and cookies are required to call the controller
   */
  public rules (route: Route, rules: RouteRules): void {
    route.rules = {}
    if (rules.query !== undefined) route.rules.query = rules.query
    if (rules.params !== undefined) route.rules.params = rules.params
    if (rules.cookies !== undefined) route.rules.cookies = rules.cookies
  }

  /**
   * Handle the request and response using the registered routes
   */
  public handle (request: Req, response: Res, websocket: WebSocket): Response | Promise<Response> {
    const { method, pathname } = request

    const route = this.routes.find(route => {
      if (route.path.includes(':')) {
        return this.findWildcardRoute(route, request)
      }

      return route.method === method && route.path === pathname
    })

    if (route === undefined) {
      return response.send({
        status: 404,
        body: {
          message: `Could not find a controller for ${method} ${pathname}`
        }
      })
    }

    if (!this.isValidRules(route, request)) {
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

    return route.handler(request, response, websocket)
  }

  /**
   * Find a route using a wildcard path
   */
  private findWildcardRoute (route: Route, request: Req): boolean {
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

  /**
   * Validate the request using the rules defined in the route
   */
  private isValidRules (route: Route, request: Req): boolean {
    if (route.rules === undefined) return true

    const { rules } = route

    if (rules.params !== undefined) {
      const missingParam = rules.params.find(param => request.params[param] === undefined)
      if (missingParam !== undefined) return false
    }

    if (rules.query !== undefined) {
      const missingQuery = rules.query.find(query => request.query[query] === undefined)
      if (missingQuery !== undefined) return false
    }

    if (rules.cookies !== undefined) {
      const missingCookie = rules.cookies.find(cookie => request.cookies[cookie] === undefined)
      if (missingCookie !== undefined) return false
    }

    return true
  }
}
