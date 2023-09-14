import { describe, it, expect, jest } from 'bun:test'
import { type UserRepository, type RoomRepository } from 'domain/interfaces'
import { CreateRoomUseCase } from 'domain/usecases'

describe('CreateRoomUseCase', () => {
  it('should create a new room', async () => {
    // Given
    const room = {
      id: 'id',
      name: 'name',
      owner: 'owner'
    }

    const roomRepository: RoomRepository = {
      ...{} as any,
      create: jest.fn(async () => await Promise.resolve(room))
    }

    const userRepository: UserRepository = {
      ...{} as any,
      create: jest.fn(async () => await Promise.resolve({ id: 'id' }))
    }

    const createRoomUseCase = new CreateRoomUseCase(roomRepository, userRepository)

    // When
    const result = await createRoomUseCase.execute({
      name: 'name',
      owner: 'owner'
    })

    // Then
    expect(result).toEqual(room)
  })
})
