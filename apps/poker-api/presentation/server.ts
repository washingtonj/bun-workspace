import { Server, Border } from 'bun-lightyear'
import { RoomController, HealthController, PlayController } from 'presentation/controllers'
import { CustomErrorHandler } from 'presentation/handlers'

const border = new Border([RoomController, HealthController, PlayController])

export const server = new Server(border.connect.bind(border), {
  port: 3000,
  errorhandler: CustomErrorHandler
})
