import { Server, Border } from 'bun-lightyear'
import { room, welcome } from './controllers'

const border = new Border([room, welcome])
export const server = new Server(border.connect.bind(border), { logger: true })
