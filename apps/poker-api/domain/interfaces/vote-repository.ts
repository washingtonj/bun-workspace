import { type VoteEntity } from 'domain/entities'

export interface FindVoteByUserIdParams {
  userId: string
  roomId: string
}

export interface FindAllVotesByRoomIdParams {
  roomId: string
}

export abstract class VoteRepository {
  abstract save (vote: VoteEntity): Promise<void>
  abstract update (vote: VoteEntity): Promise<void>
  abstract findByUserId (params: FindVoteByUserIdParams): Promise<VoteEntity | undefined>
  abstract findAllByRoomId (params: FindAllVotesByRoomIdParams): Promise<VoteEntity[]>
}
