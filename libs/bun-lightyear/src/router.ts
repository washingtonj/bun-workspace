import { LightyearRequest } from 'request'
import { LightyearResponse } from 'response'

export interface Route {
  method: RouteMethods
  path: string
  handler: RouteHandler
}

export interface RouterOptions {
  prefix?: string
  useLog?: boolean
}

export type RouteMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type RouteHandler = (request: LightyearRequest) => Promise<LightyearResponse>

export class Router {
  private readonly routes: Route[] = []

  private readonly useLog?: boolean
  private readonly prefix?: string

  constructor(options: RouterOptions = {}) {
    this.prefix = options.prefix
    this.useLog = options.useLog
  }

  private logger(method: string, url: string): void {
    if (this.prefix !== undefined) console.log(`[${method}][${this.prefix}]: ${url}`)
    else console.log(`[${method}]: ${url}`)
  }

  private handleWildcardRoute(route: Route, lightyearRequest: LightyearRequest) {
    const pathRegex = new RegExp(route.path.replace(/:[^/]+/g, '([^/]+)'))
    const match = lightyearRequest.pathname.match(pathRegex)

    if (match) {
      const params = route.path.match(/:[^/]+/g) || []
      
      params.forEach((param, index) => {
        const key = param.replace(':', '')
        const value = match[index + 1]
        lightyearRequest.params[key] = value
      })
    }

    return match !== null && route.method === lightyearRequest.method
  }

  public addRoute(method: RouteMethods, path: string, handler: RouteHandler): void {
    if (this.prefix !== undefined) path = `${this.prefix}${path}`
    this.routes.push({ method, path, handler })
  }

  public async handle(request: Request): Promise<Response> {
    const lightyearRequest = new LightyearRequest(request)
    const { method, pathname, url } = lightyearRequest
    
    if (this.useLog) this.logger(method, url)

    const route = this.routes.find(route => {
      if (route.path.includes(':')) return this.handleWildcardRoute(route, lightyearRequest)
      return route.method === method && route.path === pathname
    })

    if (route !== undefined) return (await route.handler(lightyearRequest)).toResponse()

    return new LightyearResponse({ status: 404 }).toResponse()
  }
}