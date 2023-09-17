import { randomUUID } from 'crypto'
import { RoomEntity } from 'domain/entities'
import type { CreateRoomParams, FindRoomByIdParams, SaveRoomParams, RoomRepository } from 'domain/interfaces'

const IN_MEMORY_ROOMS: RoomEntity[] = []

export class InMemoryRooms implements RoomRepository {
  private readonly rooms: RoomEntity[] = IN_MEMORY_ROOMS

  async create (params: CreateRoomParams): Promise<RoomEntity> {
    const room = new RoomEntity({
      id: randomUUID(),
      name: params.name,
      ownerId: params.ownerId,
      ownerName: params.ownerName,
      participants: []
    })

    this.rooms.push(room)

    return room
  }

  async findById (params: FindRoomByIdParams): Promise<RoomEntity | undefined> {
    return this.rooms.find(room => room.id === params.id)
  }

  async save (params: SaveRoomParams): Promise<void> {
    const roomIndex = this.rooms.findIndex(room => room.id === params.room.id)

    if (roomIndex === -1) {
      return undefined
    }

    this.rooms[roomIndex] = params.room
  }
}
