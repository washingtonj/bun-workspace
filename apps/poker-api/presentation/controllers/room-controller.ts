import { type Controller, type Request, type Response, Router } from 'bun-lightyear'
import type { RoomRepository, UserRepository } from 'domain/interfaces'
import { CreateRoomUseCase, JoinRoomUseCase, GetRoomInfoUseCase } from 'domain/usecases/room'
import { InMemoryRooms, InMemoryUsers } from 'infraestructure/repositories'

const roomRepository: RoomRepository = new InMemoryRooms()
const userRepository: UserRepository = new InMemoryUsers()

const room = new Router({ prefix: '/room' })

const createRoom: Controller = async (request: Request, response: Response) => {
  const createRoomUseCase = new CreateRoomUseCase(roomRepository, userRepository)

  const { roomName, userName } = request.query

  const room = await createRoomUseCase.execute({ name: roomName, ownerName: userName })

  return response.send({
    status: 201,
    body: room,
    cookies: {
      userId: {
        value: room.ownerId,
        path: '/',
        secure: true
      }
    }
  })
}

room
  .route('POST', '/create', createRoom)
  .rules({ query: ['roomName', 'userName'] })

const joinRoom: Controller = async (request: Request, response: Response) => {
  const joinRoomUseCase = new JoinRoomUseCase(roomRepository, userRepository)

  const { roomId } = request.params
  const { userName } = request.query

  const room = await joinRoomUseCase.execute({ roomId, userName })

  return response.send({ status: 200, body: room })
}

room
  .route('PUT', '/:roomId', joinRoom)
  .rules({ query: ['userName'], params: ['roomId'] })

const getRoom: Controller = async (request: Request, response: Response) => {
  const getRoomUseCase = new GetRoomInfoUseCase(roomRepository)

  const { roomId } = request.params
  const { userId } = request.cookies

  const room = await getRoomUseCase.execute({ roomId, userId })

  return response.send({ body: room })
}

room
  .route('GET', '/:roomId', getRoom)
  .rules({ params: ['roomId'] })

export default room
