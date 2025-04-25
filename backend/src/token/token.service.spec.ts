import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'
import { type Response } from 'express'

import { PrismaService } from '~/prisma'

import type { JwtPayload } from './interfaces'
import { TokenService } from './token.service'

describe('TokenService', () => {
  let service: TokenService
  let jwtService: { signAsync: jest.Mock; verifyAsync: jest.Mock }
  let configService: { get: jest.Mock }
  let prismaService: { user: { findUnique: jest.Mock } }

  beforeEach(async () => {
    // Setup mocks
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('test-token'),
      verifyAsync: jest.fn()
    }

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret'
        if (key === 'JWT_EXPIRES_IN') return '1h'
        if (key === 'AUTH_COOKIE_NAME') return 'auth_token'
        if (key === 'NODE_ENV') return 'development'
        if (key === 'SESSION_TTL') return 60 * 60 * 1000 // 1 hour in milliseconds
        return null
      })
    }

    prismaService = {
      user: {
        findUnique: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: PrismaService, useValue: prismaService }
      ]
    }).compile()

    service = module.get<TokenService>(TokenService)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const payload: JwtPayload = {
        sub: 'user-id',
        identifier: 'username'
      }

      const token = await service.generateToken(payload)

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'test-secret',
        expiresIn: '1h'
      })

      expect(token).toBe('test-token')
    })
  })

  describe('verifyToken', () => {
    const validPayload: JwtPayload = {
      sub: 'user-id',
      identifier: 'username'
    }

    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      username: 'username',
      hash: 'password-hash',
      firstName: 'Test',
      lastName: 'User',
      confirmed: true,
      blocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    it('should verify and return the payload for a valid token', async () => {
      jwtService.verifyAsync.mockResolvedValue(validPayload)
      prismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.verifyToken('valid-token')

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: 'test-secret'
      })

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: validPayload.sub }
      })

      expect(result).toEqual(validPayload)
    })

    it('should throw UnauthorizedException when token is invalid', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'))

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException when user not found', async () => {
      jwtService.verifyAsync.mockResolvedValue(validPayload)
      prismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.verifyToken('valid-token-unknown-user')).rejects.toThrow(
        UnauthorizedException
      )
    })
  })

  describe('getCookieOptions', () => {
    it('should return cookie options with correct values', () => {
      const options = service.getCookieOptions()

      expect(options).toEqual({
        name: 'auth_token',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
        path: '/'
      })
    })

    it('should set secure to true in production', () => {
      // Create a production config service with a mock
      const productionConfigGet = jest.fn((key: string) => {
        if (key === 'NODE_ENV') return 'production'
        if (key === 'JWT_SECRET') return 'test-secret'
        if (key === 'JWT_EXPIRES_IN') return '1h'
        if (key === 'AUTH_COOKIE_NAME') return 'auth_token'
        if (key === 'SESSION_TTL') return 60 * 60 * 1000
        return null
      })

      const productionConfigService = { get: productionConfigGet }
      const productionService = new TokenService(
        productionConfigService as unknown as ConfigService,
        jwtService as unknown as JwtService,
        prismaService as unknown as PrismaService
      )

      const options = productionService.getCookieOptions()
      expect(options.secure).toBe(true)
    })

    it('should use SESSION_TTL for cookie maxAge', () => {
      // Test with different session TTL values
      const customTtlConfigGet = jest.fn((key: string) => {
        if (key === 'SESSION_TTL') return 30 * 60 * 1000 // 30 minutes
        if (key === 'JWT_SECRET') return 'test-secret'
        if (key === 'JWT_EXPIRES_IN') return '1h'
        if (key === 'AUTH_COOKIE_NAME') return 'auth_token'
        if (key === 'NODE_ENV') return 'development'
        return null
      })

      const customTtlConfigService = { get: customTtlConfigGet }
      const customTtlService = new TokenService(
        customTtlConfigService as unknown as ConfigService,
        jwtService as unknown as JwtService,
        prismaService as unknown as PrismaService
      )

      expect(customTtlService.getCookieOptions().maxAge).toBe(30 * 60 * 1000)
    })
  })

  describe('setCookie', () => {
    it('should set cookie with JWT token', async () => {
      const cookieFn = jest.fn()
      const mockResponse = { cookie: cookieFn } as unknown as Response

      const payload: JwtPayload = {
        sub: 'user-id',
        identifier: 'username'
      }

      const token = await service.setCookie(mockResponse, payload)

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: 'test-secret',
        expiresIn: '1h'
      })

      expect(cookieFn).toHaveBeenCalledWith(
        'auth_token',
        'test-token',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 60 * 60 * 1000
        })
      )

      expect(token).toBe('test-token')
    })
  })

  describe('clearCookie', () => {
    it('should clear the auth cookie', () => {
      const clearCookieFn = jest.fn()
      const mockResponse = { clearCookie: clearCookieFn } as unknown as Response

      service.clearCookie(mockResponse)

      expect(clearCookieFn).toHaveBeenCalledWith(
        'auth_token',
        expect.objectContaining({
          httpOnly: true,
          path: '/'
        })
      )
    })
  })

  describe('extractTokenFromCookies', () => {
    it('should extract token from cookies', () => {
      const cookies = { auth_token: 'cookie-token' }

      const token = service.extractTokenFromCookies(cookies)

      expect(token).toBe('cookie-token')
    })

    it('should return null when cookie is not present', () => {
      const cookies = {}

      const token = service.extractTokenFromCookies(cookies)

      expect(token).toBeNull()
    })
  })
})
