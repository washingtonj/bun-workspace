/* eslint-disable @typescript-eslint/dot-notation */
import { describe, it, jest, spyOn, expect } from 'bun:test'
import { Server } from '../server'

describe('Server', () => {
  describe('start', () => {
    it('should start the server and return the BunServer instance', () => {
      // Given
      const router = jest.fn()
      const options = { port: 3000 }
      const server = new Server(router, options)
      const bunServer = { port: 3000 }
      const bunServeSpy = spyOn(Bun, 'serve').mockReturnValue(() => bunServer as any)
      const consoleLogSpy = spyOn(console, 'log').mockImplementation(() => jest.fn())

      // When
      server.start()

      // Then
      // expect(result).toBeInstanceOf(Server)
      expect(bunServeSpy).toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })

  describe('handler', () => {
    it('should call the router with a new Req instance and return the response', async () => {
      // Given
      const router = jest.fn().mockReturnValue({ handle: jest.fn().mockReturnValue({ toResponse: jest.fn() }) })
      const options = { logger: true }
      const server = new Server(router, options)
      const request = new Request('http://localhost:3000')

      // When
      await server['handler'](request)

      // Then
      expect(router).toHaveBeenCalled()
      expect(router(request).handle).toHaveBeenCalled()
    })

    it('should not log the request if logger option is not set', async () => {
      // Given
      const router = jest.fn().mockReturnValue({ handle: jest.fn().mockReturnValue({ toResponse: jest.fn() }) })
      const server = new Server(router)
      const request = new Request('http://localhost:3000')
      const consoleLogSpy = spyOn(console, 'log').mockReset().mockImplementation(() => jest.fn())

      // When
      await server['handler'](request)

      // Then
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })
  })
})
