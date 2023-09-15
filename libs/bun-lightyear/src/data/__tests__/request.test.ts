import { describe, it, expect } from 'bun:test'
import { Req } from '../request'

describe('Req', () => {
  describe('constructor', () => {
    it('should set the url, method, pathname, query, headers and params properties', () => {
      // Given
      const request = new Request('https://example.com/path?query=string', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token'
        }
      })

      // When
      const req = new Req(request)

      // Then
      expect(req.url).toEqual('https://example.com/path?query=string')
      expect(req.method).toEqual('POST')
      expect(req.pathname).toEqual('/path')
      expect(req.query).toEqual({ query: 'string' })
      expect(req.headers).toEqual({
        'content-type': 'application/json',
        authorization: 'Bearer token'
      })
      expect(req.params).toEqual({})
    })
  })

  describe('json', () => {
    it('should return undefined if the content-type header is not application/json', async () => {
      // Given
      const request = new Request('https://example.com', {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain'
        }
      })

      const req = new Req(request)

      // When
      const result = await req.json()

      // Then
      expect(result).toBeUndefined()
    })

    it('should return the parsed JSON body if the content-type header is application/json', async () => {
      // Given
      const request = new Request('https://example.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ foo: 'bar' })
      })

      const req = new Req(request)

      // When
      const result = await req.json()

      // Then
      expect(result).toEqual({ foo: 'bar' })
    })
  })

  describe('getQueryParams', () => {
    it('should return an empty object if there are no query parameters', () => {
      // Given
      const request = new Request('https://example.com', {
        method: 'GET'
      })

      const req = new Req(request)

      // When
      const result = req.query

      // Then
      expect(result).toEqual({})
    })

    it('should return an object with the query parameters', () => {
      // Given
      const request = new Request('https://example.com/path?foo=bar&baz=qux', {
        method: 'GET'
      })

      const req = new Req(request)

      // When
      const result = req.query

      // Then
      expect(result).toEqual({ foo: 'bar', baz: 'qux' })
    })

    it('should decode URI-encoded values', () => {
      // Given
      const request = new Request('https://example.com/path?foo=bar%20baz', {
        method: 'GET'
      })

      const req = new Req(request)

      // When
      const result = req.query

      // Then
      expect(result).toEqual({ foo: 'bar baz' })
    })
  })
})
