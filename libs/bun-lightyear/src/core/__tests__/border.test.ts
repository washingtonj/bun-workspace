import { describe, it, beforeEach, expect } from 'bun:test'
import { Border } from '../border'
import { Router } from '../router'

describe('Border', () => {
  let border: Border
  let router1: Router
  let router2: Router

  beforeEach(() => {
    router1 = new Router()
    router2 = new Router()
    border = new Border([router1, router2])
  })

  describe('connect', () => {
    it('should return the router with the matching prefix', () => {
      // Given
      const request = new Request('http://localhost:3000/api/users')

      // When
      const router = border.connect(request)

      // Then
      expect(router).toEqual(router1)
    })

    it('should return the router with the root prefix if no matching prefix is found', () => {
      // Given
      const request = new Request('http://localhost:3000/')

      // When
      const router = border.connect(request)

      // Then
      expect(router).toBe(router2)
    })
  })
})
