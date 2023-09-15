import { describe, it, expect, jest } from 'bun:test'
import { type VoteRepository } from 'domain/interfaces'
import { FlipCardsUseCase } from 'domain/usecases'

describe('FlipCardsUseCase', () => {
  it('should return all votes from a room', async () => {
    // Given
    const voteRepositoryMock: VoteRepository = {
      ...{} as any,
      findAllByRoomId: jest.fn().mockResolvedValue([
        { id: '1', userId: '1', roomId: '1', value: 1 },
        { id: '2', userId: '2', roomId: '1', value: 2 },
        { id: '3', userId: '3', roomId: '1', value: 3 }
      ])
    }

    const usecase = new FlipCardsUseCase(voteRepositoryMock)

    // When
    const votes = await usecase.execute({ roomId: '1' })

    // Then
    expect(votes).toEqual([
      { id: '1', userId: '1', roomId: '1', value: 1 },
      { id: '2', userId: '2', roomId: '1', value: 2 },
      { id: '3', userId: '3', roomId: '1', value: 3 }
    ])
  })

  it('should throw an error if there are no votes', () => {
    // Given
    const voteRepositoryMock: VoteRepository = {
      ...{} as any,
      findAllByRoomId: jest.fn().mockResolvedValue([])
    }

    // When
    const usecase = new FlipCardsUseCase(voteRepositoryMock)

    // Then
    expect(async () => await usecase.execute({ roomId: '1' })).toThrow('No votes counted yet')
  })
})
