import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'

import { PrismaService } from '~/prisma'

import type { JwtPayload } from './interfaces/jwt-payload.interface'
import { TokenService } from './token.service'

describe('TokenService', () => {
  let service: TokenService

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('test-token'),
    verifyAsync: jest.fn()
  }

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret'
      if (key === 'JWT_EXPIRES_IN') return '1h'
      return null
    })
  }

  const mockPrismaService = {
    user: {
      findUnique: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService }
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

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload, {
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
      hash: 'password-hash'
    }

    it('should verify and return the payload for a valid token', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(validPayload)
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.verifyToken('valid-token')

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: 'test-secret'
      })

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: validPayload.sub }
      })

      expect(result).toEqual(validPayload)
    })

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'))

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException when user not found', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(validPayload)
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.verifyToken('valid-token-unknown-user')).rejects.toThrow(
        UnauthorizedException
      )
    })
  })
})
