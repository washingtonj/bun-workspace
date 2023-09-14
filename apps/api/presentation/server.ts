import { Router, Server } from 'bun-lightyear'

const router = new Router()

router.addRoute('GET', '/', () => new Response('Hello, world!'))
router.addRoute('GET', '/json', () => new Response(JSON.stringify({ hello: 'world' })))

export const server = new Server(router)
