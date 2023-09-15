import { CreateRoomUseCase, JoinRoomUseCase } from 'domain/usecases'
import type { RoomRepository, UserRepository } from 'domain/interfaces'
import { InMemoryRooms, InMemoryUsers } from 'infraestructure/repositories'
import { type LightyearRequest, LightyearResponse } from 'bun-lightyear'

const roomRepository: RoomRepository = new InMemoryRooms()
const userRepository: UserRepository = new InMemoryUsers()

export async function getRoom (request: LightyearRequest): Promise<LightyearResponse> {
  const { roomId } = request.params
  const room = await roomRepository.findById({ id: roomId })
  return new LightyearResponse({ status: 200, body: room })
}

export async function createRoom (request: LightyearRequest): Promise<LightyearResponse> {
  const createRoomUseCase = new CreateRoomUseCase(roomRepository, userRepository)

  const { roomName, userName } = request.query

  if (roomName == null || userName == null) {
    return new LightyearResponse({ status: 400, body: 'Missing roomName or userName' })
  }

  const room = await createRoomUseCase.execute({ name: roomName, ownerName: userName })
  return new LightyearResponse({ status: 201, body: room })
}

export async function joinRoom (request: LightyearRequest): Promise<LightyearResponse> {
  const joinRoomUseCase = new JoinRoomUseCase(roomRepository, userRepository)

  const { roomId } = request.params
  const { userName } = request.query

  if (roomId == null || userName == null) {
    return new LightyearResponse({ status: 400, body: 'Missing roomName or userName' })
  }

  const room = await joinRoomUseCase.execute({ roomId, userName })
  return new LightyearResponse({ status: 200, body: room })
}
