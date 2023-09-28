import { Server, Border } from 'bun-lightyear'
import { RoomController, HealthController, PlayController } from 'presentation/controllers'
import { CustomErrorHandler } from 'presentation/handlers'

const border = new Border([RoomController, HealthController, PlayController])

export const server = new Server(border.connect.bind(border), {
  port: 3000,
  errorhandler: CustomErrorHandler,
  websocket: {
    message: (websocket, message) => {},

    open (ws) {
      const { type, body } = ws.data as any

      if (type === 'room:join') {
        ws.subscribe(body.room.id)
      }
    }
  },
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
})
