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
    expect(await lightyearRequest).toEqual({
      url: 'https://example.com/',
      pathname: '/',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      json: { foo: 'bar' },
      params: {},
      query: {}
    })
  }),

  test('Should transform request to LightyearRequest with query', async () => {
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
    expect(await lightyearRequest).toEqual({
      url: 'https://example.com/?foo=bar',
      pathname: '/',
      method: 'POST',
      query: { foo: 'bar' },
      headers: { 'content-type': 'application/json' },
      params: {},
      json: { foo: 'bar' }
    })
  })
})