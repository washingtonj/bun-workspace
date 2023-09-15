import { Router, Res } from 'bun-lightyear'

export const welcome = new Router()

welcome.addRoute('GET', '/', async () => new Res({ body: 'Welcome to Bun Poker API', status: 200 }))
