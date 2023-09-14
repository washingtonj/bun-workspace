import { type RoomEntity } from 'domain/entities'

export interface CreateRoomParams {
  name: string
  ownerId: string
}

export interface FindRoomByIdParams {
  id: string
}

export interface SaveRoomParams {
  room: RoomEntity
}

export abstract class RoomRepository {
  abstract create (params: CreateRoomParams): Promise<RoomEntity>
  abstract findById (params: FindRoomByIdParams): Promise<RoomEntity | null>
  abstract save (params: SaveRoomParams): Promise<void>
}
