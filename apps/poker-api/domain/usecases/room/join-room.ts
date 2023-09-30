import type { UserRepository, RoomRepository } from 'domain/interfaces'
import type { RoomEntity, UserEntity } from 'domain/entities'
import { RoomNotFoundError, UnauthorizedError } from 'domain/errors'

export interface JoinRoomUseCaseParams {
  roomId: string
  userId: string
}

export class JoinRoomUseCase {
  constructor (
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository) { }

  async execute ({ roomId, userId }: JoinRoomUseCaseParams): Promise<{ user: UserEntity, room: RoomEntity }> {
    const room = await this.roomRepository.findById({ id: roomId })

    if (room == null) {
      throw new RoomNotFoundError()
    }

    if (userId === room.ownerId) {
      return {
        user: {
          id: room.ownerId,
          name: room.ownerName

        },
        room
      }
    }

    const user = await this.userRepository.findById({ id: userId })

    if (user == null) {
      throw new UnauthorizedError()
    }

    if (room.participants.some(u => u.id === user.id)) {
      return { user, room }
    }

    room.participants.push(user)

    await this.roomRepository.save({ room })

    return { user, room }
  }
}
