import { type Controller, type Req, Res, Router } from 'bun-lightyear'
import type { RoomRepository, UserRepository } from 'domain/interfaces'
import { CreateRoomUseCase, JoinRoomUseCase, GetRoomInfoUseCase } from 'domain/usecases'
import { InMemoryRooms, InMemoryUsers } from 'infraestructure/repositories'

const roomRepository: RoomRepository = new InMemoryRooms()
const userRepository: UserRepository = new InMemoryUsers()

const getRoom: Controller = async (request: Req) => {
  const getRoomUseCase = new GetRoomInfoUseCase(roomRepository)

  const { roomId } = request.params
  const { userId } = request.query

  const room = await getRoomUseCase.execute({ roomId, userId })
  return new Res({ body: room })
}

const createRoom: Controller = async (request: Req) => {
  const createRoomUseCase = new CreateRoomUseCase(roomRepository, userRepository)

  const { roomName, userName } = request.query

  const room = await createRoomUseCase.execute({ name: roomName, ownerName: userName })
  return new Res({ status: 201, body: room })
}

const joinRoom: Controller = async (request: Req) => {
  const joinRoomUseCase = new JoinRoomUseCase(roomRepository, userRepository)

  const { roomId } = request.params
  const { userName } = request.query

  const room = await joinRoomUseCase.execute({ roomId, userName })
  return new Res({ status: 200, body: room })
}

export const room = new Router({ prefix: '/room' })

room
  .addRoute('POST', '/create', createRoom)
  .addRules({ query: ['roomName', 'userName'] })

room
  .addRoute('PUT', '/:roomId', joinRoom)
  .addRules({ query: ['userName'], params: ['roomId'] })

room
  .addRoute('GET', '/:roomId', getRoom)
  .addRules({ params: ['roomId'], query: ['userId'] })
