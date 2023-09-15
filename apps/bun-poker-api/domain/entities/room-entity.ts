export class RoomEntity {
  public readonly id!: string
  public readonly name!: string
  public readonly ownerId!: string
  public readonly participants!: string[]

  constructor (data: RoomEntity) {
    Object.assign(this, data)
  }
}
