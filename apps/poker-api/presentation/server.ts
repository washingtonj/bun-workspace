import { Server, Router, Border, Res } from 'bun-lightyear'
import { RoomController } from './controllers'

const roomRouter = new Router({ prefix: '/room' })
roomRouter.addRoute('POST', '/create', RoomController.createRoom)
roomRouter.addRoute('PUT', '/:roomId', RoomController.joinRoom)
roomRouter.addRoute('GET', '/:roomId', RoomController.getRoom)

const welcomeRouter = new Router()
welcomeRouter.addRoute('GET', '/', async () => new Res({ body: 'Welcome to Bun Poker API', status: 200 }))

const borderGateway = new Border([roomRouter, welcomeRouter])

export const server = new Server(borderGateway.connect.bind(borderGateway), { logger: true })
