/* eslint-disable @typescript-eslint/dot-notation */
import { describe, beforeEach, it, jest, expect } from 'bun:test'
import { Router } from '../router'
import { Req, Res } from 'data'

describe('Router', () => {
  let router: Router

  beforeEach(() => {
    router = new Router()
  })

  describe('addRoute', () => {
    it('should add a route to the router', () => {
      const handler = jest.fn()
      router.addRoute('GET', '/test', handler)
      expect(router['routes']).toEqual([{ method: 'GET', path: '/test', handler }])
    })

    it('should add a route with a prefix to the router', () => {
      const handler = jest.fn()
      router = new Router({ prefix: '/api' })
      router.addRoute('GET', '/test', handler)
      expect(router['routes']).toEqual([{ method: 'GET', path: '/api/test', handler }])
    })
  })

  describe('handle', () => {
    it('should handle a route with an exact path match', async () => {
      const handler = jest.fn().mockResolvedValue(new Res({ status: 200 }))
      router.addRoute('GET', '/test', handler)
      const request: Req = new Req(new Request('https://fake.com/test', { method: 'GET' }))
      const response = await router.handle(request)
      expect(response.status).toBe(200)
      expect(handler).toHaveBeenCalled()
    })

    it('should handle a route with a wildcard path match', async () => {
      const handler = jest.fn().mockResolvedValue(new Res({ status: 200 }))
      router.addRoute('GET', '/users/:id', handler)
      const request: Req = new Req(new Request('https://fake.com/users/123', { method: 'GET' }))
      const response = await router.handle(request)
      expect(response.status).toBe(200)
      expect(handler).toHaveBeenCalled()
    })

    it('should return a 404 response for a non-existent route', async () => {
      const request: Req = new Req(new Request('https://fake.com/test', { method: 'GET' }))
      const response = await router.handle(request)
      expect(response.status).toBe(404)
    })
  })
})
