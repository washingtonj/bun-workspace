import { describe, test, expect } from 'bun:test'
import { LightyearResponse } from './response'

describe('LightyearResponse', () => {
  test('toResponse() returns a Response object', () => {
    const response = new LightyearResponse({})

    expect(response.toResponse()).toBeInstanceOf(Response)
  })

  test('toResponse() returns a Response object with the correct status', () => {
    const response = new LightyearResponse({ status: 404 })

    expect(response.toResponse().status).toBe(404)
  })

  test('toResponse() returns a Response object with the correct body', () => {
    const response = new LightyearResponse({ body: 'Hello world' })

    expect(response.body).toBe('Hello world')
  })

  test('toResponse() returns a Response object with the correct headers', () => {
    const response = new LightyearResponse({
      headers: {
        'Content-Type': 'text/plain'
      }
    })

    expect(response.toResponse().headers.get('Content-Type')).toBe('text/plain')
  })
})
