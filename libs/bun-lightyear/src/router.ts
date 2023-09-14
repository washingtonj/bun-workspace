// Import the LightyearRequest and LightyearResponse classes
import { LightyearRequest } from 'request'
import { LightyearResponse } from 'response'

// Define the Route interface
export interface Route {
  method: RouteMethods
  path: string
  handler: RouteHandler
}

// Define the RouterOptions interface
export interface RouterOptions {
  prefix?: string
}

// Define the RouteMethods type
export type RouteMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Define the RouteHandler type
export type RouteHandler = (request: LightyearRequest) => LightyearResponse


// Define the Router class
export class Router {
  // Define a property to store the router prefix
  private readonly prefix?: string

  // Define an array to store the routes
  private readonly routes: Route[] = []

  constructor(options: RouterOptions = {}) {
    this.prefix = options.prefix
  }

  // Define a method to add a new route to the array
  public addRoute(method: RouteMethods, path: string, handler: RouteHandler): void {
    // If a prefix was defined, add it to the route path
    if (this.prefix !== undefined) path = `${this.prefix}${path}`

    // Add the route to the array
    this.routes.push({ method, path, handler })
  }

  // Define a method to handle incoming requests
  public handle(request: Request): Response {
    // Create a new LightyearRequest object from the incoming request
    const lightyearRequest = new LightyearRequest(request)
    
    // Extract the HTTP method and path from the LightyearRequest object
    const { method, pathname } = lightyearRequest

    // Find the first route in the array that matches the HTTP method and path
    const route = this.routes.find(route => {

      // If the route path contains a wildcard or multiple wirdcards, use a regular expression to match the incoming request path
      if (route.path.includes(':')) {
        const pathRegex = new RegExp(route.path.replace(/:[^/]+/g, '([^/]+)'))
        const match = pathname.match(pathRegex)

        // If a match was found, extract the wildcard values from the path and store them in the LightyearRequest object
        if (match) {
          const params = route.path.match(/:[^/]+/g) || []
          params.forEach((param, index) => {
            const key = param.replace(':', '')
            const value = match[index + 1]
            lightyearRequest.params[key] = value
          })
        }

        // Return true if a match was found, otherwise return false
        return match !== null
      }

      // If the route path does not contain a wildcard, compare the paths directly
      return route.method === method && route.path === pathname
    })

    // If a matching route was found, call its handler method with the LightyearRequest object and return the response
    if (route !== undefined) return route.handler(lightyearRequest).toResponse()

    // If no matching route was found, return a 404 Not Found response
    return new LightyearResponse({ status: 404 }).toResponse()
  }
}