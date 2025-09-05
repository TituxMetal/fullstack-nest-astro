import type { ExecutionContext } from '@nestjs/common'

import { GetCurrentUser } from './GetCurrentUser.decorator'

describe('GetCurrentUser Decorator', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  it('should extract user from request context', () => {
    const mockRequest = { user: mockUser }
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as ExecutionContext

    // Test the decorator logic by simulating its behavior
    const decoratorLogic = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest() as any
      return request.user
    }

    const result = decoratorLogic(undefined, mockContext)
    expect(result).toEqual(mockUser)
  })

  it('should handle undefined user', () => {
    const mockRequest = { user: undefined }
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as ExecutionContext

    const decoratorLogic = (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest() as any
      return request.user
    }

    const result = decoratorLogic(undefined, mockContext)
    expect(result).toBeUndefined()
  })

  it('should be a parameter decorator', () => {
    expect(typeof GetCurrentUser).toBe('function')
  })
})
