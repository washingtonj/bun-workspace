import { randomUUID } from 'crypto'

export class VoteEntity {
  public id!: string
  public readonly userId!: string
  public readonly roomId!: string
  public value!: string

  constructor (props: Omit<VoteEntity, 'id'>, id?: string) {
    Object.assign(this, props)
    id == null ? this.generateId() : this.id = id
  }

  private generateId (): void {
    this.id = randomUUID()
  }
}
