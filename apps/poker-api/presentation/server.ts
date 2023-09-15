import { Server, Border } from 'bun-lightyear'
import { room, welcome } from 'presentation/controllers'
import { CustomErrorHandler } from 'presentation/handlers'

const border = new Border([room, welcome])

export const server = new Server(border.connect.bind(border), {
  logger: true,
  errorhandler: CustomErrorHandler
})
