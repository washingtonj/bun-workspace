import { Server, Gateway, type WebSocketData } from 'bun-lightyear'
import { RoomController, HealthController, PlayController } from 'presentation/controllers'
import { CustomErrorHandler } from 'presentation/handlers'

const border = new Gateway([RoomController, HealthController, PlayController])

export const server = new Server(
  border.connect.bind(border),
  {
    port: 3000,
    errorhandler: CustomErrorHandler
  },
  {
    message: () => { },

    open: (ws) => {
      const { body, type } = ws.data as unknown as WebSocketData

      if (type === 'room:join') {
        ws.subscribe(body.roomId)
      }
    }
  }
)

server.start()
