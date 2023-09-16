import { describe, it, expect, jest } from 'bun:test'
import { type VoteRepository } from 'domain/interfaces'
import { VoteUseCase } from 'domain/usecases/play'

describe('VoteUseCase', () => {
  it('should update the vote if the user has already voted', async () => {
    // Given
    const voteRepositoryMock: VoteRepository = {
      ...{} as any,
      findByUserId: jest.fn(async () => await Promise.resolve({
        userId: 'user-id',
        roomId: 'room-id',
        value: '1'
      })),
      save: jest.fn()
    }

    const voteUseCase = new VoteUseCase(voteRepositoryMock)

    // When
    const vote = await voteUseCase.execute({
      userId: 'user-id',
      roomId: 'room-id',
      value: '2'
    })

    // Then
    expect(vote).toEqual({
      userId: 'user-id',
      roomId: 'room-id',
      value: '2'
    })
  })

  it('should create a new vote if the user has not voted yet', async () => {
    // Given
    const voteRepositoryMock = {
      ...{} as any,
      findByUserId: jest.fn(async () => { await Promise.resolve(undefined) }),
      save: jest.fn()
    }

    const voteUseCase = new VoteUseCase(voteRepositoryMock)

    // When
    const vote = await voteUseCase.execute({
      userId: 'user-id',
      roomId: 'room-id',
      value: '2'
    })

    // Then
    expect(vote).toEqual({
      id: expect.any(String),
      userId: 'user-id',
      roomId: 'room-id',
      value: '2'
    })
  })
})
