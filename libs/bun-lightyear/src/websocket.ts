import { type Server } from 'bun'

export class WebSocket {
  constructor (
    private readonly server: Server,
    private readonly request: Request) {}

  get isWebSocket (): boolean {
    return this.request.headers.get('upgrade') === 'websocket'
  }

  upgrade (data?: Record<string, any>, headers?: Record<string, any>): void {
    this.server.upgrade(this.request, {
      data,
      headers
    })
  }

  publish (topic: string, data?: Record<string, any>): void {
    this.server.publish(topic, JSON.stringify(data))
  }
}
