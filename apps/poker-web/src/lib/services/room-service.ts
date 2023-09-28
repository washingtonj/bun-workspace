import type { Axios } from "axios";
export class RoomService {
  constructor(private readonly httpInstance: Axios) { }

  private get baseUrl() {
    return this.httpInstance.defaults.baseURL?.split("//")[1];
  }

  async createRoom(roomName: string, userName: string) {
    interface Response {
      id: string,
      name: string,
      ownerId: string,
      ownerName: string,
      participants: []
    }

    return this.httpInstance.post<Response>("/room/create", undefined, {
      withCredentials: true,
      params: {
        roomName,
        userName
      }
    }).then(({ data }) => {
      return data;
    })
  }

  async joinRoom(roomId: string, userName?: string) {
    interface Response {
      room: {
        id: string,
        name: string,
        ownerId: string,
        ownerName: string,
        participants: {id: string, name: string}[]
      }
      user: {
        id: string,
        name: string
      }
    }

    return this.httpInstance.get<Response>(`/room/${roomId}`, {
      withCredentials: true,
      params: { userName }
    })
      .then(({ data }) => data)
  }

  roomSocket(roomId: string) {
    return new WebSocket(`ws://${this.baseUrl}/room/${roomId}`);
  }
}