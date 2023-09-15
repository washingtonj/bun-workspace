import { VoteEntity } from 'domain/entities'
import type { VoteRepository } from 'domain/interfaces'

export interface VoteUseCaseParams {
  userId: string
  roomId: string
  value: string
}

export class VoteUseCase {
  constructor (private readonly voteRepository: VoteRepository) {}

  async execute (params: VoteUseCaseParams): Promise<VoteEntity> {
    const alreadyVoted = await this.voteRepository.findByUserId({
      userId: params.userId,
      roomId: params.roomId
    })

    // Only update the vote if the user has already voted
    if (alreadyVoted !== undefined) {
      alreadyVoted.value = params.value
      await this.voteRepository.save(alreadyVoted)

      return alreadyVoted
    }

    // Otherwise, create a new vote
    const vote = new VoteEntity({
      userId: params.userId,
      roomId: params.roomId,
      value: params.value
    })

    await this.voteRepository.save(vote)

    return vote
  }
}
