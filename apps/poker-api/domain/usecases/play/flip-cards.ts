import { type VoteEntity } from 'domain/entities'
import { RoomNotFoundError, UnauthorizedError } from 'domain/errors'
import { type RoomRepository, type VoteRepository } from 'domain/interfaces'

interface FlipCardsUseCaseParams {
  roomId: string
  userId: string
}

export class FlipCardsUseCase {
  constructor (
    private readonly voteRepository: VoteRepository,
    private readonly roomRepository: RoomRepository
  ) { }

  async execute (params: FlipCardsUseCaseParams): Promise<VoteEntity[]> {
    const room = await this.roomRepository.findById({ id: params.roomId })

    if (room === undefined) throw new RoomNotFoundError()

    const userIsParticipant =
      room.participants.some(participant => participant.id === params.userId) ||
      room.ownerId === params.userId

    if (!userIsParticipant) throw new UnauthorizedError()

    const votes = await this.voteRepository.findAllByRoomId({
      roomId: params.roomId
    })

    if (votes.length === 0) {
      throw new Error('No votes counted yet')
    }

    return votes
  }
}
