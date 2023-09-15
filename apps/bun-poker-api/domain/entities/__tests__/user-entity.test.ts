import { describe, it, expect } from 'bun:test'
import { UserEntity } from 'domain/entities'

describe('UserEntity', () => {
  it('should create a new UserEntity', () => {
    // Given
    const data = {
      id: 'id',
      name: 'name',
      email: 'email',
      password: 'password'
    }

    // When
    const user = new UserEntity(data)

    // Then
    expect(user).toEqual(data)
  })
})
