import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { Prisma } from '@prisma/client'
import * as argon from 'argon2'

import { TokenService } from '~/token'
import { UserService } from '~/user'
import { type UserEntity } from '~/user/entities'
import { UserNotFoundException } from '~/user/exceptions'

import { AuthService } from './auth.service'
import type { LoginDto } from './dto/login.dto'
import type { RegisterDto } from './dto/register.dto'

const mockPrismaUser: UserEntity = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  hash: '$argon2id$v=19$m=65536,t=3,p=4$hash',
  firstName: 'Test',
  lastName: 'User',
  confirmed: true,
  blocked: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('AuthService', () => {
  let service: AuthService
  let userService: jest.Mocked<UserService>
  let tokenService: jest.Mocked<TokenService>
  let verifyMock: jest.SpyInstance

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            findByEmailOrUsername: () => Promise.resolve(mockPrismaUser),
            create: () => Promise.resolve(mockPrismaUser)
          }
        },
        {
          provide: TokenService,
          useValue: {
            generateToken: () => Promise.resolve('token'),
            verifyToken: () => Promise.resolve(true)
          }
        },
        {
          provide: AuthService,
          useFactory: (userService: UserService, tokenService: TokenService) =>
            new AuthService(userService, tokenService),
          inject: [UserService, TokenService]
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get(UserService)
    tokenService = module.get(TokenService)
    verifyMock = jest.spyOn(argon, 'verify')
  })

  afterEach(() => {
    verifyMock.mockReset()
    verifyMock.mockRestore()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'testuser',
      password: 'password123'
    }

    it('should return user and token for valid credentials', async () => {
      const findByEmailOrUsername = jest.fn().mockResolvedValue(mockPrismaUser)
      userService.findByEmailOrUsername = findByEmailOrUsername
      verifyMock.mockResolvedValue(true)
      const generateToken = jest.fn().mockResolvedValue('token')
      tokenService.generateToken = generateToken

      const result = await service.login(loginDto)

      expect(findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier)
      expect(verifyMock).toHaveBeenCalledWith(mockPrismaUser.hash, loginDto.password)
      expect(generateToken).toHaveBeenCalledWith({
        sub: mockPrismaUser.id,
        identifier: mockPrismaUser.username
      })
      expect(result).toEqual({
        user: mockPrismaUser,
        token: 'token'
      })
    })

    it('should throw UnauthorizedException when user is not found', async () => {
      const findByEmailOrUsername = jest
        .fn()
        .mockRejectedValue(new UserNotFoundException('testuser'))
      userService.findByEmailOrUsername = findByEmailOrUsername

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
      expect(findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier)
      expect(verifyMock).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException when password is invalid', async () => {
      const findByEmailOrUsername = jest.fn().mockResolvedValue(mockPrismaUser)
      userService.findByEmailOrUsername = findByEmailOrUsername
      verifyMock.mockResolvedValue(false)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
      expect(findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier)
      expect(verifyMock).toHaveBeenCalledWith(mockPrismaUser.hash, loginDto.password)
    })

    it('should throw UnauthorizedException when user is blocked', async () => {
      const blockedUser = { ...mockPrismaUser, blocked: true }
      const findByEmailOrUsername = jest.fn().mockResolvedValue(blockedUser)
      userService.findByEmailOrUsername = findByEmailOrUsername
      verifyMock.mockResolvedValue(true)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
      expect(findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier)
      expect(verifyMock).toHaveBeenCalledWith(blockedUser.hash, loginDto.password)
    })
  })

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }

    it('should create a new user and return user with token', async () => {
      const create = jest.fn().mockResolvedValue(mockPrismaUser)
      userService.create = create
      const generateToken = jest.fn().mockResolvedValue('token')
      tokenService.generateToken = generateToken

      const result = await service.register(registerDto)

      expect(create).toHaveBeenCalledWith(registerDto)
      expect(generateToken).toHaveBeenCalledWith({
        sub: mockPrismaUser.id,
        identifier: mockPrismaUser.username
      })
      expect(result).toEqual({
        user: mockPrismaUser,
        token: 'token'
      })
    })

    it('should throw ConflictException when user already exists', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint violation', {
        code: 'P2002',
        clientVersion: '5.x',
        meta: { target: ['email'] }
      })
      const create = jest.fn().mockRejectedValue(prismaError)
      userService.create = create

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException)
      expect(create).toHaveBeenCalledWith(registerDto)
    })
  })
})
