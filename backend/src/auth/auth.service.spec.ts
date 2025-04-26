import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import * as argon from 'argon2'
import { type Response } from 'express'

import { PrismaService } from '~/prisma/prisma.service'
import { TokenService } from '~/token'
import { UserService } from '~/user'

import { AuthService } from './auth.service'
import type { LoginDto } from './dto/login.dto'
import type { RegisterDto } from './dto/register.dto'

describe('AuthService', () => {
  let service: AuthService

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn()
    }
  }

  const mockTokenService = {
    clearCookie: jest.fn()
  }

  const mockUserService = {
    create: jest.fn()
  }

  const mockResponse = {
    clearCookie: jest.fn()
  } as unknown as Response

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'testuser',
      password: 'password123'
    }

    const user = {
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

    it('should return user and payload for valid credentials', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(user)
      jest.spyOn(argon, 'verify').mockResolvedValue(true)

      const result = await service.login(loginDto)

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: loginDto.identifier }, { username: loginDto.identifier }]
        }
      })

      expect(argon.verify).toHaveBeenCalledWith(user.hash, loginDto.password)

      expect(result).toEqual({
        user,
        payload: {
          sub: user.id,
          identifier: user.username
        }
      })
    })

    it('should throw UnauthorizedException when user is not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
      expect(mockPrismaService.user.findFirst).toHaveBeenCalled()
      expect(argon.verify).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(user)
      jest.spyOn(argon, 'verify').mockResolvedValue(false)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
      expect(argon.verify).toHaveBeenCalledWith(user.hash, loginDto.password)
    })

    it('should throw UnauthorizedException when user is blocked', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({
        ...user,
        blocked: true
      })
      jest.spyOn(argon, 'verify').mockResolvedValue(true)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw InternalServerErrorException when argon throws an error', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(user)
      jest.spyOn(argon, 'verify').mockRejectedValue(new Error('Argon error'))

      await expect(service.login(loginDto)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'new@example.com',
      username: 'newuser',
      password: 'password123',
      firstName: 'New',
      lastName: 'User'
    }

    const createdUser = {
      id: '2',
      email: 'new@example.com',
      username: 'newuser',
      hash: '$argon2id$v=19$m=65536,t=3,p=4$hash',
      firstName: 'New',
      lastName: 'User',
      confirmed: true,
      blocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    it('should create and return a new user with payload', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null)

      mockUserService.create.mockResolvedValue(createdUser)

      const result = await service.register(registerDto)

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: registerDto.email }, { username: registerDto.username }]
        }
      })

      expect(mockUserService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        username: registerDto.username,
        password: registerDto.password,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName
      })

      expect(result).toEqual({
        user: createdUser,
        payload: {
          sub: createdUser.id,
          identifier: createdUser.username
        }
      })
    })

    it('should throw ConflictException when email or username already exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: 'existing-id' })

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException)
      expect(mockUserService.create).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('should clear the auth cookie and return success message', () => {
      const result = service.logout(mockResponse)

      expect(mockTokenService.clearCookie).toHaveBeenCalledWith(mockResponse)
      expect(result).toEqual({ message: 'Logged out successfully' })
    })
  })
})
