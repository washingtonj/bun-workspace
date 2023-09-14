import type { RoomRepository, UserRepository } from 'domain/interfaces'
import type { RoomEntity } from 'domain/entities'

export interface CreateRoomUseCaseParams {
  name: string
  owner: string
}

export class CreateRoomUseCase {
  constructor (
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository
  ) { }

  async execute (params: CreateRoomUseCaseParams): Promise<RoomEntity> {
    const user = await this.userRepository.create({
      name: params.owner
    })

    const room = await this.roomRepository.create({
      name: params.name,
      ownerId: user.id
    })

    return room
  }
}
