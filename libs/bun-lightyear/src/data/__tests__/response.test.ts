import { describe, expect, it } from 'bun:test'
import { Res } from '../response'

describe('Res', () => {
  describe('toResponse', () => {
    it('should return a Response object with default status 200 and empty body and headers', () => {
      // Given
      const res = new Res({})

      // When
      const response = res.toResponse()

      // Then
      expect(response.status).toBe(200)
      expect(response.body).toBeNull()
      expect(response.headers).toEqual({})
    })

    it('should return a Response object with the given status, body and headers', async () => {
      // Given
      const res = new Res({
        status: 404,
        body: { message: 'Not found' },
        headers: { 'x-custom-header': 'foo' }
      })

      // When
      const response = res.toResponse()

      // Then
      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ message: 'Not found' })
      expect(response.headers.toJSON()).toEqual({
        'content-type': 'application/json',
        'x-custom-header': 'foo'
      })
    })

    it('should set the content-type header to application/json if the body is an object', () => {
      // Given
      const res = new Res({ body: { message: 'Hello, world!' } })

      // When
      const response = res.toResponse()

      // Then
      expect(response.headers.toJSON()).toEqual({ 'content-type': 'application/json' })
    })

    it('should set the content-type header to text/html if the body is a string', () => {
      // Given
      const res = new Res({ body: '<h1>Hello, world!</h1>' })

      // When
      const response = res.toResponse()

      // Then
      expect(response.headers.toJSON()).toEqual({ 'content-type': 'text/html' })
    })
  })
})
