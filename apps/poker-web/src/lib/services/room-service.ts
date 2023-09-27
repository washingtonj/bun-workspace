import type { Axios } from "axios";

export class RoomService {
  constructor(private readonly httpInstance: Axios) { }

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

  async getRoom(roomId: string) {
    interface Response {
      id: string,
      name: string,
      ownerId: string,
      ownerName: string,
      participants: {id: string, name: string}[]
    }

    return this.httpInstance.get<Response>(`/room/${roomId}`, {
      withCredentials: true
    });
  }
}