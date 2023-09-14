import { Router, Server, LightyearResponse, Controller } from 'bun-lightyear'

const getHello: Controller = (req) => new LightyearResponse({ body: `Hello ${req.params[0]}` })
const getHelloWildcard: Controller = (req) => new LightyearResponse({ body: `Hello ${req.params.name}` })
const getHelloQuery: Controller = (req) => new LightyearResponse({ body: `Hello ${req.query.name}` })

const router = new Router({ prefix: '/api' })

router.addRoute('GET', '/', getHello)
router.addRoute('GET', '/hello', getHelloQuery)
router.addRoute('GET', '/hello/:name', getHelloWildcard)

export const server = new Server(router)