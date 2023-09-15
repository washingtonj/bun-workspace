import { Router, Server } from 'bun-lightyear'
import { RoomController } from './controllers'


const router = new Router({ prefix: '/room', useLog: true })

router.addRoute('POST', '/create', RoomController.createRoom)
router.addRoute('PUT', '/:roomId', RoomController.joinRoom)
router.addRoute('GET', '/:roomId', RoomController.getRoom)


export const server = new Server(router)