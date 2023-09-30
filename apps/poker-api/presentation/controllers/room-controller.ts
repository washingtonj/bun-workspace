import { type Controller, Router } from 'bun-lightyear'
import type { RoomRepository, UserRepository } from 'domain/interfaces'
import { CreateRoomUseCase, JoinRoomUseCase } from 'domain/usecases/room'
import { InMemoryRooms, InMemoryUsers } from 'infraestructure/repositories'

const roomRepository: RoomRepository = new InMemoryRooms()
const userRepository: UserRepository = new InMemoryUsers()

const roomController = new Router({ prefix: '/room' })

interface CreateRoomRequest {
  query: { roomName: string, userName: string }
}

interface CreateRoomResponse {
  roomId: string
  roomName: string
  ownerId: string
  ownerName: string
}

const createRoom: Controller = async (request, response) => {
  const { roomName, userName } = request.query as CreateRoomRequest['query']

  const createRoomUseCase = new CreateRoomUseCase(roomRepository, userRepository)
  const room = await createRoomUseCase.execute({ name: roomName, ownerName: userName })

  return response.send({
    status: 201,
    cookies: {
      Authorization: {
        value: room.ownerId,
        path: '/'
      }
    },
    body: {
      roomId: room.id,
      roomName: room.name,
      ownerId: room.ownerId,
      ownerName: room.ownerName
    } satisfies CreateRoomResponse
  })
}

roomController
  .route('POST', '/create', createRoom)
  .rules({ query: ['roomName', 'userName'] })

// ----------------------------------------------------------------------------------------------

interface JoinRoomRequest {
  params: { roomId: string }
  cookies: { Authorization: string }
}

interface JoinRoomResponse {
  roomId: string
  roomName: string
  ownerId: string
  ownerName: string
  players: Array<{
    id: string
    name: string
  }>
}

const joinRoom: Controller = async (request, response, websocket) => {
  const { roomId } = request.params as JoinRoomRequest['params']
  const { Authorization } = request.cookies as JoinRoomRequest['cookies']

  const joinRoomUseCase = new JoinRoomUseCase(roomRepository, userRepository)
  const joinInformation = await joinRoomUseCase.execute({ roomId, userId: Authorization })

  if (websocket.isWebSocket) {
    websocket.upgrade({
      type: 'room:join',
      body: joinInformation
    })

    websocket.publish(roomId, {
      type: 'room:update',
      body: joinInformation.room
    })
  }

  return response.send({
    status: 200,
    body: {
      roomId: joinInformation.room.id,
      roomName: joinInformation.room.name,
      ownerId: joinInformation.room.ownerId,
      ownerName: joinInformation.room.ownerName,
      players: joinInformation.room.participants
    } satisfies JoinRoomResponse
  })
}

roomController
  .route('GET', '/:roomId', joinRoom)
  .rules({ params: ['roomId'], cookies: ['Authorization'] })

// ----------------------------------------------------------------------------------------------

export default roomController
