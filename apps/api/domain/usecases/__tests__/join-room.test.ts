import { describe, it, expect, jest } from 'bun:test'
import { JoinRoomUseCase } from 'domain/usecases'
import { type RoomRepository, type UserRepository } from 'domain/interfaces'
import { RoomNotFoundError, UserNotFoundError } from 'domain/errors'
import { type UserEntity, type RoomEntity } from 'domain/entities'

describe('JoinRoomUseCase', () => {
  it('should throw RoomNotFoundError if room is not found', async () => {
    // Given
    const params = {
      roomId: '123',
      userName: 'John Doe'
    }

    const roomRepository: RoomRepository = {
      ...{} as any,
      findById: jest.fn().mockReturnValue(null)
    }

    const userRepository: UserRepository = {
      ...{} as any
    }

    const usecase = new JoinRoomUseCase(roomRepository, userRepository)

    // Then
    expect(async () => { await usecase.execute(params) }).toThrow(new RoomNotFoundError())
  })

  it('should throw UserNotFoundError if user id is not found', async () => {
    // Given
    const params = {
      roomId: '123',
      userName: 'John Doe',
      userId: '456'
    }

    const roomRepository: RoomRepository = {
      ...{} as any,
      findById: jest.fn().mockReturnValue({})
    }

    const userRepository: UserRepository = {
      ...{} as any,
      findById: jest.fn().mockReturnValue(null)
    }

    const usecase = new JoinRoomUseCase(roomRepository, userRepository)

    // Then
    expect(async () => { await usecase.execute(params) }).toThrow(new UserNotFoundError())
  })

  it('should create a new user if userId is not provided', async () => {
    // Given
    const params = {
      roomId: '123',
      userName: 'John Doe'
    }

    const roomRepository: RoomRepository = {
      ...{} as any,
      findById: jest.fn().mockReturnValue({
        id: '123',
        name: 'Room 1',
        ownerId: '456',
        participants: []
      } satisfies RoomEntity),
      save: jest.fn().mockReturnValue({})
    }

    const userRepository: UserRepository = {
      ...{} as any,
      create: jest.fn().mockReturnValue({
        id: '789',
        name: params.userName
      } satisfies UserEntity)
    }

    const usecase = new JoinRoomUseCase(roomRepository, userRepository)

    // When
    const room = await usecase.execute(params)

    // Then
    expect(room).toEqual({
      id: '123',
      name: 'Room 1',
      ownerId: '456',
      participants: ['789']
    })
  })

  it('should add existing user to the room if userId is provided', async () => {
    // Given
    const params = {
      roomId: '123',
      userName: 'John Doe',
      userId: '789'
    }

    const roomRepository: RoomRepository = {
      ...{} as any,
      findById: jest.fn().mockReturnValue({
        id: '123',
        name: 'Room 1',
        ownerId: '456',
        participants: []
      } satisfies RoomEntity),
      save: jest.fn().mockReturnValue({})
    }

    const userRepository: UserRepository = {
      ...{} as any,
      findById: jest.fn().mockReturnValue({
        id: '789',
        name: 'John Doe'
      } satisfies UserEntity)
    }

    const usecase = new JoinRoomUseCase(roomRepository, userRepository)

    // When
    const room = await usecase.execute(params)

    // Then
    expect(room).toEqual({
      id: '123',
      name: 'Room 1',
      ownerId: '456',
      participants: ['789']
    })
  })
})
