import { type UserEntity } from 'domain/entities'

export interface CreateUserParams {
  name: string
}

export interface FindUserByIdParams {
  id: string
}

export abstract class UserRepository {
  abstract create (params: CreateUserParams): Promise<UserEntity>
  abstract findById (params: FindUserByIdParams): Promise<UserEntity | undefined>
}
