import { describe, test, expect } from 'bun:test'
import { LightyearRequest } from './request'

describe('LightyearRequest', () => {
  test('Should transform request to LightyearRequest', async () => {
    // Given
    const request = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ foo: 'bar' })
    })

    // When
    const lightyearRequest = new LightyearRequest(request)

    // Then
    expect(lightyearRequest).toEqual({
      url: 'https://example.com/',
      pathname: '/',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      params: {},
      query: {},
      request: expect.any(Request)
    })
  })

  test('Should transform request to LightyearRequest with query', () => {
    // Given
    const request = new Request('https://example.com?foo=bar', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ foo: 'bar' })
    })

    // When
    const lightyearRequest = new LightyearRequest(request)

    // Then
    expect(lightyearRequest.query).toEqual({ foo: 'bar' })
  })

  test('Should get json from request', async () => {
    // Given
    const request = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ foo: 'bar' })
    })

    // When
    const lightyearRequest = new LightyearRequest(request)

    // Then
    expect(await lightyearRequest.json()).toEqual({ foo: 'bar' })
  })
})
