import type { UserRepository, RoomRepository } from 'domain/interfaces'
import type { RoomEntity, UserEntity } from 'domain/entities'
import { RoomNotFoundError, UserNotFoundError } from 'domain/errors'

export interface JoinRoomUseCaseParams {
  roomId: string
  userId?: string
  userName: string
}

export class JoinRoomUseCase {
  constructor (
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository) { }

  async execute ({ roomId, userId, userName }: JoinRoomUseCaseParams): Promise<{ user: UserEntity, room: RoomEntity }> {
    const room = await this.roomRepository.findById({ id: roomId })

    if (room == null) {
      throw new RoomNotFoundError()
    }

    const user = userId != null
      ? await this.userRepository.findById({ id: userId })
      : await this.userRepository.create({ name: userName })

    if (user == null) {
      throw new UserNotFoundError()
    }

    if (room.participants.some(u => u.id === user.id)) {
      return { user, room }
    }

    room.participants.push(user)

    await this.roomRepository.save({ room })

    return { user, room }
  }
}
