import type { RoomRepository, UserRepository } from 'domain/interfaces'
import { CreateRoomUseCase } from 'domain/usecases'
import { InMemoryRooms, InMemoryUsers } from 'infraestructure/repositories'

export class RoomController {
  private readonly CreateRoomUseCase: CreateRoomUseCase
  private readonly RoomRepository: RoomRepository
  private readonly UserRepository: UserRepository

  constructor (private readonly request: Request) {
    this.RoomRepository = new InMemoryRooms()
    this.UserRepository = new InMemoryUsers()
    this.CreateRoomUseCase = new CreateRoomUseCase(this.RoomRepository, this.UserRepository)
  }

  public async handle (): Promise<Response> {
    const { pathname } = new URL(this.request.url)

    switch (pathname) {
      case '/room':
        return await this.createRoom()
      default:
        return new Response('Not found', { status: 404 })
    }
  }

  private async createRoom (): Promise<any> {
    const { searchParams } = new URL(this.request.url)

    const roomName = searchParams.get('roomName')
    const userName = searchParams.get('userName')

    if (roomName == null || userName == null) {
      return new Response('Missing parameters', { status: 400 })
    }

    const room = await this.CreateRoomUseCase.execute({ name: roomName, ownerName: userName })
    return new Response(JSON.stringify(room), { status: 201 })
  }
}
