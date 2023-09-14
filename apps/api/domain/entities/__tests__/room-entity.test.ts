import { describe, it, expect } from 'bun:test'
import { RoomEntity } from 'domain/entities'

describe('RoomEntity', () => {
  it('should create a new RoomEntity', () => {
    // Given
    const data = {
      id: 'id',
      name: 'name',
      ownerId: 'owner',
      participants: []
    }

    // When
    const room = new RoomEntity(data)

    // Then
    expect(room).toEqual(data)
  })
})
