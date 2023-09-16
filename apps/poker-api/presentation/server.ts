import { Server, Border } from 'bun-lightyear'
import { RoomController, HealthController } from 'presentation/controllers'
import { CustomErrorHandler } from 'presentation/handlers'

const border = new Border([RoomController, HealthController])

export const server = new Server(border.connect.bind(border), {
  port: 3000,
  errorhandler: CustomErrorHandler
})
