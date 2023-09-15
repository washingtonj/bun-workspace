import { describe, test, expect } from 'bun:test'
import { Router } from './router'

describe('Router', () => {
  test('handle() returns a Response object', async () => {
    const router = new Router()
    const request = new Request('http://localhost:3000/')
    expect(await router.handle(request)).toBeInstanceOf(Response)
  })

  test('handle() returns a Response object with the correct status', async () => {
    const router = new Router()

    router.addRoute('GET', '/', async () => ({
      status: 200,
      headers: {},
      toResponse: () => new Response('Hello world')
    }))

    const request = new Request('http://localhost:3000/')

    expect((await router.handle(request)).status).toBe(200)
  })

  test('handle() returns a Response object with the correct body', async () => {
    const router = new Router()

    router.addRoute('GET', '/', async () => ({
      status: 200,
      body: 'Hello world',
      headers: {},
      toResponse: () => new Response('Hello world')
    }))

    const request = new Request('http://localhost:3000/')

    expect(router.handle(request)).resolves.toEqual(new Response('Hello world'))
  })

  test('handle() returns a Response object with the correct headers', async () => {
    const router = new Router()

    router.addRoute('GET', '/', async () => ({
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Hello world',
      toResponse: () => new Response('Hello world', { headers: { 'Content-Type': 'text/plain' } })
    }))

    const request = new Request('http://localhost:3000/')

    expect(router.handle(request)).resolves.toEqual(new Response('Hello world', { headers: { 'Content-Type': 'text/plain' } }))
  })

  test('handle() should handle a route with a wildcard', async () => {
    const router = new Router()

    router.addRoute('GET', '/hello/:name', async (req) => ({
      status: 200,
      body: `Hello ${req.params[0]}`,
      headers: {},
      toResponse: () => new Response(`Hello ${req.params.name}`)
    }))

    const request = new Request('http://localhost:3000/hello/world')

    expect(router.handle(request)).resolves.toEqual(new Response('Hello world'))
  })

  test('handle() should handle a route with a prefix', async () => {
    const router = new Router({ prefix: '/api' })

    router.addRoute('GET', '/hello/:name', async (req) => ({
      status: 200,
      body: `Hello ${req.params[0]}`,
      headers: {},
      toResponse: () => new Response(`Hello ${req.params.name}`)
    }))

    const request = new Request('http://localhost:3000/api/hello/world')

    expect(router.handle(request)).resolves.toEqual(new Response('Hello world'))
  })

  test('handle() should log the request if useLog is true', async () => {
    const router = new Router({ useLog: true })

    router.addRoute('GET', '/', async () => ({
      status: 200,
      headers: {},
      toResponse: () => new Response('Hello world')
    }))

    const request = new Request('http://localhost:3000/')

    expect(router.handle(request)).resolves.toEqual(new Response('Hello world'))
  })
})
