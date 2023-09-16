import type { RoomRepository, UserRepository } from 'domain/interfaces'
import type { RoomEntity } from 'domain/entities'

export interface CreateRoomUseCaseParams {
  name: string
  ownerName: string
}

export class CreateRoomUseCase {
  constructor (
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository
  ) { }

  async execute (params: CreateRoomUseCaseParams): Promise<RoomEntity> {
    const user = await this.userRepository.create({
      name: params.ownerName
    })

    const room = await this.roomRepository.create({
      name: params.name,
      ownerId: user.id,
      ownerName: params.ownerName
    })

    return room
  }
}
