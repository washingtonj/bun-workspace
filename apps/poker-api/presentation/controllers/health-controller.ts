import { Router } from 'bun-lightyear'

const health = new Router()

health.route('GET', '/', async (_req, res) => res.send({ body: '🐰 Hi, A bun-lighyear server is working here!' }))

export default health
