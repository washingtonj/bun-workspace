import { type Controller, Router } from 'bun-lightyear'
import type { RoomRepository, UserRepository } from 'domain/interfaces'
import { CreateRoomUseCase, JoinRoomUseCase } from 'domain/usecases/room'
import { InMemoryRooms, InMemoryUsers } from 'infraestructure/repositories'

const roomRepository: RoomRepository = new InMemoryRooms()
const userRepository: UserRepository = new InMemoryUsers()

const room = new Router({ prefix: '/room' })

const createRoom: Controller = async (request, response) => {
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

const joinRoom: Controller = async (request, response, websocket) => {
  const joinRoomUseCase = new JoinRoomUseCase(roomRepository, userRepository)

  const { roomId } = request.params
  const { userId } = request.cookies
  const { userName } = request.query

  const joinInformation = await joinRoomUseCase.execute({ roomId, userId, userName })

  if (websocket.isWebSocket) {
    websocket.upgrade({
      type: 'room:join',
      body: joinInformation
    })

    websocket.publish(roomId, { ...joinInformation.room })
  }

  return response.send({
    status: 200,
    body: joinInformation,
    cookies: {
      userId: {
        value: joinInformation.user.id,
        path: '/',
        secure: true
      }
    }
  })
}

room
  .route('GET', '/:roomId', joinRoom)
  .rules({ params: ['roomId'] })

export default room
