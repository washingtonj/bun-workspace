import type { UserRepository, RoomRepository } from 'domain/interfaces'
import type { RoomEntity } from 'domain/entities'
import { RoomNotFoundError, UserNotFoundError } from 'domain/errors'

export interface JoinRoomUseCaseParams {
  roomId: string
  userName: string
  userId?: string
}

export class JoinRoomUseCase {
  constructor (
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository) { }

  async execute (params: JoinRoomUseCaseParams): Promise<RoomEntity> {
    const room = await this.roomRepository.findById({
      id: params.roomId
    })

    if (room === null) {
      throw new RoomNotFoundError()
    }

    const user = params.userId === undefined
      ? await this.userRepository.create({ name: params.userName })
      : await this.userRepository.findById({ id: params.userId })

    if (user === null) {
      throw new UserNotFoundError()
    }

    room.participants.push(user.id)

    await this.roomRepository.save({ room })

    return room
  }
}
