import { type ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test, type TestingModule } from '@nestjs/testing'

import { IS_PUBLIC_KEY } from '~/auth/decorators'
import type { JwtPayload } from '~/token'
import { TokenService } from '~/token'

import { JwtAuthGuard } from './jwtAuth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard

  const mockTokenService = {
    verifyToken: jest.fn(),
    extractTokenFromCookies: jest.fn()
  }

  const mockReflector = {
    getAllAndOverride: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: TokenService, useValue: mockTokenService },
        { provide: Reflector, useValue: mockReflector }
      ]
    }).compile()

    guard = module.get<JwtAuthGuard>(JwtAuthGuard)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('canActivate', () => {
    it('should return true for public routes', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(true)

      const context = createMockExecutionContext()

      const result = await guard.canActivate(context as unknown as ExecutionContext)

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        expect.any(Object),
        expect.any(Object)
      ])

      expect(result).toBe(true)
    })

    it('should throw UnauthorizedException when no token is provided in cookies or headers', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false)
      mockTokenService.extractTokenFromCookies.mockReturnValue(null)

      const context = createMockExecutionContext({
        headers: { authorization: undefined },
        cookies: {}
      })

      await expect(guard.canActivate(context as unknown as ExecutionContext)).rejects.toThrow(
        UnauthorizedException
      )
    })

    it('should extract token from cookies when available', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false)
      mockTokenService.extractTokenFromCookies.mockReturnValue('cookie-token')

      const payload: JwtPayload = {
        sub: 'user-id',
        identifier: 'username'
      }

      mockTokenService.verifyToken.mockResolvedValue(payload)

      const context = createMockExecutionContext({
        headers: { authorization: undefined },
        cookies: { auth_token: 'cookie-token' }
      })

      const result = await guard.canActivate(context as unknown as ExecutionContext)

      expect(mockTokenService.extractTokenFromCookies).toHaveBeenCalledWith(
        expect.objectContaining({ auth_token: 'cookie-token' })
      )
      expect(mockTokenService.verifyToken).toHaveBeenCalledWith('cookie-token')
      expect(result).toBe(true)
    })

    it('should fall back to authorization header when no cookie is present', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false)
      mockTokenService.extractTokenFromCookies.mockReturnValue(null)

      const payload: JwtPayload = {
        sub: 'user-id',
        identifier: 'username'
      }

      mockTokenService.verifyToken.mockResolvedValue(payload)

      const context = createMockExecutionContext({
        headers: { authorization: 'Bearer header-token' },
        cookies: {}
      })

      const result = await guard.canActivate(context as unknown as ExecutionContext)

      expect(mockTokenService.extractTokenFromCookies).toHaveBeenCalled()
      expect(mockTokenService.verifyToken).toHaveBeenCalledWith('header-token')
      expect(result).toBe(true)
    })

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false)
      mockTokenService.extractTokenFromCookies.mockReturnValue('cookie-token')
      mockTokenService.verifyToken.mockRejectedValue(new Error('Invalid token'))

      const context = createMockExecutionContext({
        cookies: { auth_token: 'cookie-token' }
      })

      await expect(guard.canActivate(context as unknown as ExecutionContext)).rejects.toThrow(
        UnauthorizedException
      )
    })

    it('should return true and attach user to request when token is valid', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false)

      const payload: JwtPayload = {
        sub: 'user-id',
        identifier: 'username'
      }

      mockTokenService.verifyToken.mockResolvedValue(payload)

      let reqUserValue: JwtPayload | undefined

      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token'
        },
        cookies: {},
        get user(): JwtPayload | undefined {
          return reqUserValue
        },
        set user(value: JwtPayload) {
          reqUserValue = value
        }
      }

      mockTokenService.extractTokenFromCookies.mockReturnValue(null)

      const mockHttpContext = {
        getRequest: () => mockRequest
      }

      const mockContext = {
        switchToHttp: () => mockHttpContext,
        getHandler: () => ({}),
        getClass: () => ({})
      }

      const result = await guard.canActivate(mockContext as unknown as ExecutionContext)

      expect(mockTokenService.verifyToken).toHaveBeenCalledWith('valid-token')
      expect(reqUserValue).toEqual(payload)
      expect(result).toBe(true)
    })
  })
})

const createMockExecutionContext = (request = {}) => {
  const mockRequest = {
    headers: { authorization: 'Bearer test-token' },
    cookies: {},
    ...request
  }

  return {
    switchToHttp: () => ({
      getRequest: () => mockRequest
    }),
    getHandler: () => ({}),
    getClass: () => ({})
  }
}
