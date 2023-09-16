import { type RoomEntity } from 'domain/entities'
import { RoomNotFoundError, UnauthorizedError } from 'domain/errors'
import { type RoomRepository } from 'domain/interfaces'

interface GetRoomInfoUseCaseParams {
  roomId: string
  userId: string
}

export class GetRoomInfoUseCase {
  constructor (private readonly roomRepository: RoomRepository) {}

  public async execute (params: GetRoomInfoUseCaseParams): Promise<RoomEntity> {
    // verify if the room exists
    const roomInfo = await this.roomRepository.findById({ id: params.roomId })

    if (roomInfo === undefined) throw new RoomNotFoundError()

    // Verify if the user is a participant of the room
    const userIsAParticipant = roomInfo.participants.find(participant => participant.id === params.userId)
    const userIsOwner = roomInfo.ownerId === params.userId

    // If user is a participant return the informations of the room
    if (userIsAParticipant != null || userIsOwner) return roomInfo

    // else return a non-authorizated information
    throw new UnauthorizedError()
  }
}
