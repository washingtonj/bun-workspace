import type { VoteEntity } from 'domain/entities'
import type { FindAllVotesByRoomIdParams, FindVoteByUserIdParams, VoteRepository } from 'domain/interfaces'

const IN_MEMORY_VOTES: VoteEntity[] = []

export class InMemoryVotes implements VoteRepository {
  private readonly votes: VoteEntity[] = IN_MEMORY_VOTES

  async save (vote: VoteEntity): Promise<void> {
    this.votes.push(vote)
  }

  async update (vote: VoteEntity): Promise<void> {
    const index = this.votes.findIndex(v => v.id === vote.id)
    this.votes[index] = vote
  }

  async findByUserId (params: FindVoteByUserIdParams): Promise<VoteEntity | undefined> {
    return this.votes.find(vote => vote.userId === params.userId)
  }

  async findAllByRoomId (params: FindAllVotesByRoomIdParams): Promise<VoteEntity[]> {
    return this.votes.filter(vote => vote.roomId === params.roomId)
  }
}
