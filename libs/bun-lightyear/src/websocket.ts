import { type Server } from 'bun'

export interface WebSocketData {
  type: string
  body: Record<string, any>
}
export class WebSocket {
  constructor (
    private readonly server: Server,
    private readonly request: Request) {}

  get isWebSocket (): boolean {
    return this.request.headers.get('upgrade') === 'websocket'
  }

  upgrade (data?: WebSocketData, headers?: Record<string, any>): void {
    this.server.upgrade(this.request, {
      data,
      headers
    })
  }

  publish (topic: string, data?: WebSocketData): void {
    this.server.publish(topic, JSON.stringify(data))
  }
}
