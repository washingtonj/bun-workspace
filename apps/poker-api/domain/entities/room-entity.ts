import { type UserEntity } from '.'

export class RoomEntity {
  public readonly id!: string
  public readonly name!: string
  public readonly ownerId!: string
  public readonly ownerName!: string
  public readonly participants!: UserEntity[]

  constructor (data: RoomEntity) {
    Object.assign(this, data)
  }
}
