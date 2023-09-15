import type { VoteEntity } from 'domain/entities'
import type { FindAllVotesByRoomIdParams, FindVoteByUserIdParams, VoteRepository } from 'domain/interfaces'

export class InMemoryVotes implements VoteRepository {
  private readonly votes: VoteEntity[] = []

  async save (vote: VoteEntity): Promise<void> {
    this.votes.push(vote)
  }

  async findByUserId (params: FindVoteByUserIdParams): Promise<VoteEntity | undefined> {
    return this.votes.find(vote => vote.userId === params.userId)
  }

  async findAllByRoomId (params: FindAllVotesByRoomIdParams): Promise<VoteEntity[]> {
    return this.votes.filter(vote => vote.roomId === params.roomId)
  }
}
