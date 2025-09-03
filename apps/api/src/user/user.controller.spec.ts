import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import type { TestingModule } from '@nestjs/testing'

import { JwtService } from '~/auth/infrastructure/services'
import { ConfigService } from '~/config'
import { TokenService } from '~/token'

import type { UserEntity } from './entities'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController

  const mockUserService = {
    getProfile: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }

  const mockTokenService = {
    verifyToken: jest.fn()
  }

  const mockJwtService = {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
    decodeToken: jest.fn()
  }

  const mockConfigService = {
    jwt: {
      secret: 'test-secret',
      expiresIn: '1h'
    },
    auth: {
      cookieName: 'auth_token'
    },
    extractTokenFromCookies: jest.fn(
      (cookies: Record<string, string>) => cookies?.['auth_token'] || null
    )
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: TokenService,
          useValue: mockTokenService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        Reflector
      ]
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getProfile', () => {
    const mockUser: UserEntity = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      confirmed: true,
      createdAt: new Date(),
      updatedAt: new Date()
    } as UserEntity

    it('should return user profile', async () => {
      mockUserService.getProfile.mockResolvedValue(mockUser)

      const result = await controller.getProfile({ sub: '1' })

      expect(mockUserService.getProfile).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockUser)
    })
  })

  describe('updateProfile', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      confirmed: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updateDto = {
      username: 'newusername',
      firstName: 'New',
      lastName: 'Name'
    }

    it('should update user profile', async () => {
      mockUserService.update.mockResolvedValue(mockUser)

      const result = await controller.updateProfile({ sub: '1' }, updateDto)

      expect(mockUserService.update).toHaveBeenCalledWith('1', updateDto)
      expect(result).toEqual(mockUser)
    })
  })

  describe('deleteProfile', () => {
    it('should delete user profile', async () => {
      mockUserService.remove.mockResolvedValue(undefined)

      await controller.deleteProfile({ sub: '1' })

      expect(mockUserService.remove).toHaveBeenCalledWith('1')
    })
  })
})
