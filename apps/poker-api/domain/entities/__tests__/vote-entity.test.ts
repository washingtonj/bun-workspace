import { describe, it, expect } from 'bun:test'
import { VoteEntity } from 'domain/entities'

describe('VoteEntity', () => {
  it('should create a new vote entity', () => {
    // Given
    const voteEntity = new VoteEntity({
      userId: 'user-id',
      roomId: 'post-id',
      value: '1'
    })

    // Then
    expect(voteEntity).toEqual({
      id: expect.any(String),
      userId: 'user-id',
      roomId: 'post-id',
      value: '1'
    })
  })

  it('should create a new vote entity with a given id', () => {
    // Given
    const voteEntity = new VoteEntity({
      userId: 'user-id',
      roomId: 'post-id',
      value: '1'
    }, 'vote-id')

    // Then
    expect(voteEntity).toEqual({
      id: 'vote-id',
      userId: 'user-id',
      roomId: 'post-id',
      value: '1'
    })
  })
})
