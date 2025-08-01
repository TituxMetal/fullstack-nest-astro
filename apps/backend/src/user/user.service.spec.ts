import { Test, type TestingModule } from '@nestjs/testing'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon2 from 'argon2'

import { PrismaService } from '~/prisma'

import { type UserEntity } from './entities'
import { UserNotFoundException } from './exceptions'
import { UserService } from './user.service'

const mockPrismaUser: UserEntity = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  hash: 'hashed-password',
  confirmed: true,
  blocked: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('UserService', () => {
  let service: UserService
  let prismaService: PrismaService

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn()
    }
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser'
      }

      const mockHash = '$argon2id$v=19$m=65536,t=3,p=4$mockHash'
      jest.spyOn(argon2, 'hash').mockResolvedValue(mockHash)

      const spy = jest.spyOn(prismaService.user, 'create')
      spy.mockResolvedValue(mockPrismaUser)

      const result = await service.create(createUserDto)

      expect(result).toEqual(mockPrismaUser)
      expect(spy).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          username: createUserDto.username,
          hash: mockHash
        }
      })
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockPrismaUser]

      const spy = jest.spyOn(prismaService.user, 'findMany')
      spy.mockResolvedValue(users)

      const result = await service.findAll()

      expect(result).toHaveLength(1)
      expect(result).toEqual([mockPrismaUser])
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const spy = jest.spyOn(prismaService.user, 'findUnique')
      spy.mockResolvedValue(mockPrismaUser)

      const result = await service.findOne('1')

      expect(result).toEqual(mockPrismaUser)
      expect(spy).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })

    it('should throw UserNotFoundException when user is not found', async () => {
      const spy = jest.spyOn(prismaService.user, 'findUnique')
      spy.mockResolvedValue(null)

      await expect(service.findOne('1')).rejects.toThrow(UserNotFoundException)
    })
  })

  describe('findByEmailOrUsername', () => {
    it('should find user by email', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockPrismaUser)

      const result = await service.findByEmailOrUsername('test@example.com')

      expect(result).toEqual(mockPrismaUser)
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: 'test@example.com' }, { username: 'test@example.com' }]
        }
      })
    })

    it('should find user by username', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockPrismaUser)

      const result = await service.findByEmailOrUsername('testuser')

      expect(result).toEqual(mockPrismaUser)
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: 'testuser' }, { username: 'testuser' }]
        }
      })
    })

    it('should throw UserNotFoundException when user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null)

      await expect(service.findByEmailOrUsername('notfound')).rejects.toThrow(UserNotFoundException)
    })
  })

  describe('getProfile', () => {
    it('should return user profile data', async () => {
      const spy = jest.spyOn(service, 'findOne')
      spy.mockResolvedValue(mockPrismaUser)

      const result = await service.getProfile('1')

      expect(result).toEqual(mockPrismaUser)
      expect(spy).toHaveBeenCalledWith('1')
    })

    it('should throw UserNotFoundException when user is not found', async () => {
      const spy = jest.spyOn(service, 'findOne')
      spy.mockRejectedValue(new UserNotFoundException('1'))

      await expect(service.getProfile('1')).rejects.toThrow(UserNotFoundException)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        firstName: 'Updated'
      }

      const updatedPrismaUser = {
        ...mockPrismaUser,
        firstName: 'Updated'
      }

      const spy = jest.spyOn(prismaService.user, 'update')
      spy.mockResolvedValue(updatedPrismaUser)

      const result = await service.update('1', updateUserDto)

      expect(result).toEqual(updatedPrismaUser)
      expect(spy).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto
      })
    })

    it('should throw UserNotFoundException when user is not found', async () => {
      const updateUserDto = {
        firstName: 'Updated'
      }

      const spy = jest.spyOn(prismaService.user, 'update')
      spy.mockRejectedValue(
        new PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '' })
      )

      await expect(service.update('1', updateUserDto)).rejects.toThrow(UserNotFoundException)
    })
  })

  describe('remove', () => {
    it('should delete a user', async () => {
      const spy = jest.spyOn(prismaService.user, 'delete')
      spy.mockResolvedValue(mockPrismaUser)

      await service.remove('1')

      expect(spy).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })

    it('should throw UserNotFoundException when user is not found', async () => {
      const spy = jest.spyOn(prismaService.user, 'delete')
      spy.mockRejectedValue(
        new PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '' })
      )

      await expect(service.remove('1')).rejects.toThrow(UserNotFoundException)
    })
  })
})
