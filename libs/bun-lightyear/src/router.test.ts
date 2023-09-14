import { describe, test, expect } from 'bun:test'
import { Router } from './router'

describe('Router', () => {
  test('handle() returns a Response object', () => {
    const router = new Router()
    const request = new Request('http://localhost:3000/')
    expect(router.handle(request)).toBeInstanceOf(Response)
  })

  test('handle() returns a Response object with the correct status', () => {
    const router = new Router()

    router.addRoute('GET', '/', () => ({
      status: 200,
      body: 'Hello world',
      headers: {},
      toResponse: () => new Response('Hello world'),
    }))

    const request = new Request('http://localhost:3000/', {
      
    })

    expect(router.handle(request).status).toBe(200)
  })

  test('handle() returns a Response object with the correct body', async () => {
    const router = new Router()

    router.addRoute('GET', '/', () => ({
      status: 200,
      body: 'Hello world',
      headers: {},
      toResponse: () => new Response('Hello world'),
    }))

    const request = new Request('http://localhost:3000/')

    expect(await router.handle(request).text()).toBe('Hello world')
  })

  test('handle() returns a Response object with the correct headers', () => {
    const router = new Router()

    router.addRoute('GET', '/', () => ({
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'Hello world',
      toResponse: () => new Response('Hello world', { headers: { 'Content-Type': 'text/plain' } }),
    }))

    const request = new Request('http://localhost:3000/')

    expect(router.handle(request).headers.get('content-type')).toBe('text/plain')
  })

  test('handle() should handle a route with a wildcard', async () => {
    const router = new Router()

    router.addRoute('GET', '/hello/:name', (req) => ({
      status: 200,
      body: `Hello ${req.params[0]}`,
      headers: {},
      toResponse: () => new Response(`Hello ${req.params.name}`),
    }))

    const request = new Request('http://localhost:3000/hello/world')

    expect(await router.handle(request).text()).toBe('Hello world')
  })
})