import { type Controller, type Req, Res } from 'bun-lightyear'
import { CreateRoomUseCase, JoinRoomUseCase, GetRoomInfoUseCase } from 'domain/usecases'
import { RoomRepository, UserRepository } from 'domain/interfaces'
import { InMemoryRooms, InMemoryUsers } from 'infraestructure/repositories'

const roomRepository: RoomRepository = new InMemoryRooms()
const userRepository: UserRepository = new InMemoryUsers()

export const getRoom: Controller = async (request: Req) => {
  const getRoomUseCase = new GetRoomInfoUseCase(roomRepository)

  const { roomId } = request.params
  const { userId } = request.query

  if (roomId === null || userId === null) {
    return new Res({ status: 400, body: 'Missing roomId or userId' })
  }

  const room = await getRoomUseCase.execute({ roomId, userId })
  return new Res({ body: room })
}

export const createRoom: Controller = async (request: Req) => {
  const createRoomUseCase = new CreateRoomUseCase(roomRepository, userRepository)

  const { roomName, userName } = request.query

  if (roomName == null || userName == null) {
    return new Res({ status: 400, body: 'Missing roomName or userName' })
  }

  const room = await createRoomUseCase.execute({ name: roomName, ownerName: userName })
  return new Res({ status: 201, body: room })
}

export const joinRoom: Controller = async (request: Req) => {
  const joinRoomUseCase = new JoinRoomUseCase(roomRepository, userRepository)

  const { roomId } = request.params
  const { userName } = request.query

  if (roomId == null || userName == null) {
    return new Res({ status: 400, body: 'Missing roomName or userName' })
  }

  const room = await joinRoomUseCase.execute({ roomId, userName })
  return new Res({ status: 200, body: room })
}
