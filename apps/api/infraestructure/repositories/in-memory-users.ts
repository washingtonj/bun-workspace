import { randomUUID } from 'crypto'
import { UserEntity } from 'domain/entities'
import type { FindUserByIdParams, UserRepository, CreateUserParams } from 'domain/interfaces'

export class InMemoryUsers implements UserRepository {
  private readonly users: UserEntity[] = []

  async create (params: CreateUserParams): Promise<UserEntity> {
    const user = new UserEntity({
      id: randomUUID(),
      name: params.name
    })

    this.users.push(user)

    return user
  }

  async findById (params: FindUserByIdParams): Promise<UserEntity | undefined> {
    return this.users.find(user => user.id === params.id)
  }
}
