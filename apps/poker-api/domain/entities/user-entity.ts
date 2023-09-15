export class UserEntity {
  public readonly id!: string
  public readonly name!: string

  constructor (data: UserEntity) {
    Object.assign(this, data)
  }
}
