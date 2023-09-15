import { type VoteEntity } from 'domain/entities'
import { type VoteRepository } from 'domain/interfaces'

interface FlipCardsUseCaseParams {
  roomId: string
}

export class FlipCardsUseCase {
  constructor (private readonly voteRepository: VoteRepository) { }

  async execute (params: FlipCardsUseCaseParams): Promise<VoteEntity[]> {
    const votes = await this.voteRepository.findAllByRoomId({
      roomId: params.roomId
    })

    if (votes.length === 0) {
      throw new Error('No votes counted yet')
    }

    return votes
  }
}
